import { Request, Response } from "express";
import { parse } from "csv-parse/sync";
import {
  checkReviewerAlreadyExists,
  CreateReviewerService,
  getReviewers,
  DeleteReviewerService,
} from "../../repository/reviewers/reviewers.repo";

// ... (previous logic)

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

type ReviewerCSVRow = {
  name: string;
  email: string;
  designation?: string;
};

export const CreateReviewer = async (req: Request, res: Response) => {
  try {
    const { name, email, designation } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const exists = await checkReviewerAlreadyExists(email);
    if (exists) {
      return res.status(409).json({
        message: "Reviewer with this email already exists",
      });
    }

    const created_by = (req as any).user?.id;

    const reviewer = await CreateReviewerService({
      name,
      email,
      designation,
      created_by,
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

    const result = await getReviewers({ page, limit, search });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      message: error.message || "Failed to fetch reviewers",
    });
  }
};

export const BulkUploadReviewers = async (req: Request, res: Response) => {
  try {
      console.log('req :', req)
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
      const row = records[i];
      const { name, email, designation } = row;

      if (!name || !email) {
        errors.push({ row: i + 2, error: "Name and email required" });
        continue;
      }

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.push({ row: i + 2, error: "Invalid email" });
        continue;
      }

      const exists = await checkReviewerAlreadyExists(email)
    //   const exists = await pool.query(
    //     "SELECT 1 FROM reviewers WHERE email = $1",
    //     [email],
    //   );

      if (exists) {
        errors.push({ row: i + 2, error: "Email already exists" });
        continue;
      }
      const newReviewer = {
        name,
        email,
        designation,
        created_by: (req as any).user?.id
      }
      await CreateReviewerService(newReviewer)
    //   await pool.query(
    //     `INSERT INTO reviewers (name, email, designation, created_by)
    //      VALUES ($1, $2, $3, $4)`,
    //     [name, email, designation || null, req.user.id], // assuming auth middleware
    //   );

      successCount++;
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
