import { Request, Response } from "express";
import { jobCreation } from "../../repository/jobs/jobs.repo";

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
