import { Request, Response } from "express";
import { getAssignedJobsForReviewer } from "../../repository/reviewers/reviewers.repo";

export const getAssignedJobs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const reviewerId = user.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await getAssignedJobsForReviewer(reviewerId, page, limit, search);

    return res.json({ 
      success: true,
      data: result.jobs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error: any) {
    console.error("getAssignedJobs error:", error);
    return res.status(500).json({ message: error.message || "Failed to fetch assigned jobs" });
  }
};
