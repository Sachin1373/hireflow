import { Request, Response } from "express";
import { z } from "zod";
import { getPublicJobBySlug } from "../../repository/jobs/jobs.repo";
import {
  createPublicApplication,
  hasExistingApplication,
} from "../../repository/applications/applications.repo";

const applicationSchema = z.object({
  candidate_name: z.string().trim().min(1, "Candidate name is required"),
  candidate_email: z.string().trim().email("Valid candidate email is required"),
  candidate_phone: z.string().trim().optional(),
  resume_url: z.string().trim().optional(),
  responses: z.array(
    z.object({
      field_id: z.string().uuid("Invalid field id"),
      value: z.string().trim(),
    })
  ),
});

export const GetPublicJob = async (req: Request, res: Response) => {
  try {
    const tokenParam = req.params.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const job = await getPublicJobBySlug(token);
    if (!job) {
      return res.status(404).json({ message: "Invalid application link" });
    }

    const isExpired = !!job.form_expires_at && new Date(job.form_expires_at) < new Date();
    return res.status(200).json({
      success: true,
      data: {
        title: job.title,
        description: job.description,
        jd_content: job.jd_content,
        form_expires_at: job.form_expires_at,
        is_expired: isExpired,
        fields: job.fields,
      },
    });
  } catch (error) {
    console.error("GetPublicJob error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const SubmitPublicApplication = async (req: Request, res: Response) => {
  try {
    const tokenParam = req.params.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const parsed = applicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request payload",
        errors: parsed.error.flatten(),
      });
    }

    const job = await getPublicJobBySlug(token);
    if (!job) {
      return res.status(404).json({ message: "Invalid application link" });
    }

    if (job.form_expires_at && new Date(job.form_expires_at) < new Date()) {
      return res.status(410).json({ message: "This application link has expired" });
    }

    const payload = parsed.data;
    const existing = await hasExistingApplication(job.id, payload.candidate_email);
    if (existing) {
      return res.status(409).json({ message: "Application already submitted for this email" });
    }

    const fieldsById = new Map(job.fields.map((field: any) => [field.id, field]));
    const submittedById = new Map(payload.responses.map((response) => [response.field_id, response.value]));

    for (const field of job.fields) {
      if (field.required) {
        const value = submittedById.get(field.id);
        if (!value || !value.trim()) {
          return res.status(400).json({ message: `${field.label} is required` });
        }
      }
    }

    const allowedResponses = payload.responses.filter((response) => fieldsById.has(response.field_id));

    const created = await createPublicApplication({
      job_id: job.id,
      org_id: (job as any).org_id,
      candidate_name: payload.candidate_name,
      candidate_email: payload.candidate_email,
      candidate_phone: payload.candidate_phone,
      resume_url: payload.resume_url,
      responses: allowedResponses,
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: created,
    });
  } catch (error) {
    console.error("SubmitPublicApplication error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
