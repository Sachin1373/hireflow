import { Request, Response } from "express";
import {
  getAssignedJobsForReviewer,
  getAssignedApplications,
  reviewerUpdateApplicationStatus
} from "../../repository/reviewers/reviewers.repo";

export const getAssignedJobs = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const reviewerId = user.id as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await getAssignedJobsForReviewer(
      reviewerId,
      page,
      limit,
      search,
    );

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
    return res
      .status(500)
      .json({ message: error.message || "Failed to fetch assigned jobs" });
  }
};

export const getAssignedApplicatinsbyreviewer = async (
  req: Request,
  res: Response,
) => {
  try {
    const reviewer_id = (req as any).user.user_id;
    const { jobId } = req.params;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const result = await getAssignedApplications(
      reviewer_id,
      jobId as string,
      page,
      limit,
    );

    return res.status(200).json({
      success: true,
      data: result.applications,
      pagination: {
        total: result.total,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("getAssignedApplicatinsbyreviewer error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const reviewer_id = (req as any).user.user_id;
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!applicationId) {
      return res.status(400).json({
        message: "Application ID required",
      });
    }

    const allowed = [
      "SELECTED",
      "REJECTED",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const updated =
      await reviewerUpdateApplicationStatus(
        reviewer_id,
        applicationId as string,
        status
      );

    if (!updated) {
      return res.status(404).json({
        message:
          "Application not assigned to reviewer",
      });
    }

    return res.status(200).json({
      success: true,
      data: updated,
    });

  } catch (error) {
    console.error(
      "updateApplicationStatus error:",
      error
    );

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
