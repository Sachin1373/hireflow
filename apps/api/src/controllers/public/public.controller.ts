import { Request, Response } from "express";
import { z } from "zod";
import { getPublicJobBySlug } from "../../repository/jobs/jobs.repo";
import {
  createPublicApplication,
  hasExistingApplication,
} from "../../repository/applications/applications.repo";

const applicationSchema = z.object({
  responses: z.array(
    z.object({
      field_id: z.string().uuid("Invalid field id"),
      value: z.string().trim(),
    })
  ),
});

type PublicField = {
  id: string;
  field_type?: string;
  label?: string;
};

const inferCandidateProfile = (
  fields: PublicField[],
  submittedById: Map<string, string>
) => {
  let candidate_name = "";
  let candidate_email = "";
  let candidate_phone = "";
  let resume_url = "";

  for (const field of fields) {
    const value = (submittedById.get(field.id) || "").trim();
    if (!value) continue;

    const label = (field.label || "").toLowerCase();
    const type = (field.field_type || "").toLowerCase();

    if (!candidate_name && (label.includes("name") || label.includes("full name"))) {
      candidate_name = value;
    }

    if (!candidate_email && (type === "email" || label.includes("email"))) {
      candidate_email = value;
    }

    if (!candidate_phone && (label.includes("phone") || label.includes("mobile"))) {
      candidate_phone = value;
    }

    if (!resume_url && (type === "file" || label.includes("resume") || label.includes("cv"))) {
      resume_url = value;
    }
  }

  return {
    candidate_name: candidate_name || "Candidate",
    candidate_email,
    candidate_phone: candidate_phone || undefined,
    resume_url: resume_url || undefined,
  };
};

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
    const fieldsById = new Map(job.fields.map((field: any) => [field.id, field]));
    const submittedById = new Map(payload.responses.map((response) => [response.field_id, response.value]));

    const inferred = inferCandidateProfile(job.fields, submittedById);
    if (!inferred.candidate_email) {
      return res.status(400).json({ message: "Form response must include an email field" });
    }

    const existing = await hasExistingApplication(job.id, inferred.candidate_email);
    if (existing) {
      return res.status(409).json({ message: "Application already submitted for this email" });
    }

    for (const field of job.fields) {
      if (field.required) {
        const value = submittedById.get(field.id);
        if (!value || !value.trim()) {
          return res.status(400).json({ message: `${field.label} is required` });
        }
      }
    }

    const allowedResponses = payload.responses.filter((response) => fieldsById.has(response.field_id));
    // return;
    const created = await createPublicApplication({
      job_id: job.id,
      org_id: job.org_id,
      candidate_name: inferred.candidate_name,
      candidate_email: inferred.candidate_email,
      candidate_phone: inferred.candidate_phone,
      resume_url: inferred.resume_url,
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

export const UploadPublicResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    return res.status(201).json({
      success: true,
      data: {
        file_name: req.file.originalname,
        stored_name: req.file.filename,
        url: resumeUrl,
      },
    });
  } catch (error) {
    console.error("UploadPublicResume error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
