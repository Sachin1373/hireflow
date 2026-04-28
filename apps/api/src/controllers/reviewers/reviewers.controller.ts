import { Request, Response } from "express";
import { parse } from "csv-parse/sync";
import * as bcrypt from "bcrypt";
import {
  checkReviewerAlreadyExists,
  CreateReviewerService,
  getReviewers,
  DeleteReviewerService,
  AssignReviewersToJob,
} from "../../repository/reviewers/reviewers.repo";
import { sendEmail } from "../../services/email/sendEmail";
import { inviteUserTemplate } from "../../services/email/templates/inviteUserTemplate";

export const DeleteReviewer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Reviewer ID is required" });
    }

    const reviewer = await DeleteReviewerService(id as string);

    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found" });
    }

    return res.json({
      success: true,
      message: "Reviewer deleted successfully",
    });
  } catch (error: any) {
    console.error("DeleteReviewer error:", error);
    return res.status(500).json({
      message: error.message || "Failed to delete reviewer",
    });
  }
};

import { UpdateUser } from "../../repository/users/createUser";

// ... (other types)

export const UpdateReviewer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { org_id } = (req as any).user;
    const data = req.body;

    const updatedReviewer = await UpdateUser(id as string, org_id, data);

    if (!updatedReviewer) {
      return res
        .status(404)
        .json({ message: "Reviewer not found or nothing to update" });
    }

    res.json({
      success: true,
      data: updatedReviewer,
    });
  } catch (error: any) {
    console.error("UpdateReviewer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

type ReviewerCSVRow = {
  name: string;
  email: string;
  designation?: string;
  password?: string;
};

export const CreateReviewer = async (req: Request, res: Response) => {
  try {
    const { name, email, designation } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const exists = await checkReviewerAlreadyExists(email);
    if (exists) {
      return res.status(409).json({
        message: "Reviewer with this email already exists",
      });
    }

    const tempPassword = Math.random().toString(36).slice(-8) + "@A1";

    const { org_id, id: created_by } = (req as any).user;
    const hashPassword = await bcrypt.hash(tempPassword, 10);

    const reviewer = await CreateReviewerService({
      name,
      email,
      designation,
      created_by,
      org_id,
      password: hashPassword,
    });

    await sendEmail({
      to: email,
      subject: "Your HireFlow Account",
      html: inviteUserTemplate({
        firstName: name,
        email,
        tempPassword,
      }),
    });

    return res.status(201).json({
      success: true,
      data: reviewer,
    });
  } catch (error: any) {
    console.error("CreateReviewer error:", error);

    return res.status(500).json({
      message: error.message || "Failed to create reviewer",
    });
  }
};

export const getAllReviewers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const { org_id } = (req as any).user;

    const result = await getReviewers({ page, limit, search, org_id });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch reviewers",
    });
  }
};

export const BulkUploadReviewers = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "CSV file is required" });
    }
    const csvString = file.buffer.toString("utf-8");

    const records = parse(csvString, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as ReviewerCSVRow[];

    const errors: any[] = [];
    let successCount = 0;

    for (let i = 0; i < records.length; i++) {
      const { name, email, designation, password } = records[i];

      if (!name || !email || !password) {
        errors.push({
          row: i + 2,
          error: "Name, email, and password are required",
        });
        continue;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.push({ row: i + 2, error: "Invalid email" });
        continue;
      }

      const exists = await checkReviewerAlreadyExists(email);
      if (exists) {
        errors.push({ row: i + 2, error: "Email already exists" });
        continue;
      }
      const tempPassword = Math.random().toString(36).slice(-8) + "@A1";

      const { org_id, id: created_by } = (req as any).user;
      const hashPassword = await bcrypt.hash(tempPassword, 10);

      const newReviewer = {
        name,
        email,
        designation,
        created_by,
        org_id,
        password: hashPassword,
      };
      await CreateReviewerService(newReviewer);

      successCount++;

      await sendEmail({
        to: email,
        subject: "Your HireFlow Account",
        html: inviteUserTemplate({
          firstName: name,
          email,
          tempPassword,
        }),
      });
    }
    return res.json({
      successCount,
      failedCount: errors.length,
      errors,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Bulk upload failed" });
  }
};

export const SaveJobReviewers = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { reviewerIds } = req.body;
    const { org_id } = (req as any).user;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!Array.isArray(reviewerIds)) {
      return res.status(400).json({ message: "Reviewer IDs must be an array" });
    }

    await AssignReviewersToJob(jobId as string, reviewerIds, org_id);

    return res.json({
      success: true,
      message: "Reviewers assigned successfully",
    });
  } catch (error: any) {
    console.error("SaveJobReviewers error:", error);
    return res.status(500).json({
      message: error.message || "Failed to assign reviewers",
    });
  }
};
