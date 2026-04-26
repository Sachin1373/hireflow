import { Request, Response } from "express";
import { createFormFields, getFormFieldsByJobId } from "../../repository/formFields/formFields.repo";
import { getJobStatusById } from "../../repository/jobs/jobs.repo";

export const SaveFormFields = async (req: Request, res: Response) => {
  try {
    const  org_id  = (req as any).user.org_id;
    const { job_id } = req.params;
    const { fields } = req.body; 
    
    if (!job_id) {
       return res.status(400).json({ message: "Job ID required" });
    }

    const existingJob = await getJobStatusById(job_id as string, org_id);
    if (!existingJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (existingJob.status === "submitted") {
      return res.status(400).json({ message: "Submitted jobs cannot be edited" });
    }

    const savedFields = await createFormFields(org_id as string, job_id as string, fields || []);
    res.status(200).json({ success: true, data: savedFields });
  } catch (error) {
    console.error("SaveFormFields error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetFormFields = async (req: Request, res: Response) => {
  try {
    const { job_id } = req.params;
    if (!job_id) return res.status(400).json({ message: "Job ID required" });

    const fields = await getFormFieldsByJobId(job_id as string);
    res.status(200).json({ success: true, data: fields });
  } catch (error) {
    console.error("GetFormFields error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
