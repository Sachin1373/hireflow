import { Request, Response } from "express";
import { getApplications } from "../../repository/applications/applications.repo";

export const GetJobApplications = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    if (!job_id) {
      return res.status(400).json({
        message: "Job ID is required",
      });
    }

    const result = await getApplications(job_id as string,  page, limit, search);
    return res.status(200).json({
      data: result.applications,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error: any) {
    console.error("Get applications error:", error);

    return res.status(500).json({
      message: error.message || "Failed to fetch applications",
    });
  }
};
