import { Request, Response } from "express";
import { getAllJobs, jobCreation } from "../../repository/jobs/jobs.repo";

export const CreateJob = async (req: Request, res: Response) => {
  try {
    const { title, description, jd_content } = req.body;
    const user_id = (req as any).user?.user_id;
    const org_id = (req as any).user?.org_id;
    if (!title || !description || !jd_content) {
      return res.status(400).json({ message: "titile, desc, jd required" });
    }

    const job = await jobCreation(
      {
        title,  
        description,
        jd_content,
      },
      user_id,
      org_id,
    );

    return res.status(201).json({
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("CreateJob Error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const GetAllJobs = async(req: Request, res: Response) => {
  try {
    const { org_id } = (req as any).user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await getAllJobs(org_id, page, limit, search);

    return res.status(200).json({
      success: true,
      data: result.jobs,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit
      }
    });
  } catch (error: any) {
    console.error("GetAllJobs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
