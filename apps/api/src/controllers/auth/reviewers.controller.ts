
import { Request, Response } from "express";
import { checkReviewerAlreadyExists, CreateReviewerService, getReviewers } from "../../repository/reviewers/reviewers.repo";

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
}

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
