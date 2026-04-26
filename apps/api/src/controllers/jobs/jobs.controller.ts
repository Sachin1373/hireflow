import { Request, Response } from "express";
import {
  getAllJobs,
  jobCreation,
  getJobById,
  updateJob,
  assignJobReviewers,
  deleteJob,
  getJobStatusById,
} from "../../repository/jobs/jobs.repo";

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

export const GetJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { org_id } = (req as any).user;
    
    if (!id) {
       return res.status(400).json({ message: "Job ID required" });
    }

    const job = await getJobById(id as string, org_id);
    if (!job) {
       return res.status(404).json({ message: "Job not found" });
    }
    
    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("GetJob error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const UpdateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { org_id } = (req as any).user;
    const data = req.body;

    if (!id) {
       return res.status(400).json({ message: "Job ID required" });
    }

    const existingJob = await getJobStatusById(id as string, org_id);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found or nothing to update" });
    }

    if (existingJob.status === "submitted") {
      return res.status(400).json({ message: "Submitted jobs cannot be edited" });
    }

    const job = await updateJob(id as string, data, org_id);
    if (!job) {
       return res.status(404).json({ message: "Job not found or nothing to update" });
    }
    
    return res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("UpdateJob error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const DeleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { org_id } = (req as any).user;

    if (!id) {
      return res.status(400).json({ message: "Job ID required" });
    }

    const deleted = await deleteJob(id as string, org_id);
    if (!deleted) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("DeleteJob error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const SaveJobReviewers = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;
    const { reviewerIds } = req.body;
    const { org_id } = (req as any).user;

    if (!job_id) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!Array.isArray(reviewerIds)) {
      return res.status(400).json({ message: "Reviewer IDs must be an array" });
    }

    const existingJob = await getJobStatusById(job_id as string, org_id);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.status === "submitted") {
      return res.status(400).json({ message: "Submitted jobs cannot be edited" });
    }

    const result = await assignJobReviewers(job_id as string, reviewerIds, org_id);

    return res.status(200).json({
      success: true,
      message: "Reviewers saved successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("SaveJobReviewers error:", error);

    if (error?.message === "Job not found") {
      return res.status(404).json({ message: "Job not found" });
    }

    if (error?.message === "One or more reviewers are invalid") {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
