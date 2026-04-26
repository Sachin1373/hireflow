import pool from "../../db/client";

type ApplicationResponseInput = {
  field_id: string;
  value: string;
};

type CreatePublicApplicationInput = {
  job_id: string;
  org_id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string | null;
  resume_url?: string | null;
  responses: ApplicationResponseInput[];
};

export const hasExistingApplication = async (job_id: string, candidate_email: string) => {
  const result = await pool.query(
    `SELECT id
     FROM applications
     WHERE job_id = $1 AND LOWER(candidate_email) = LOWER($2)
     LIMIT 1`,
    [job_id, candidate_email]
  );
  return (result.rowCount ?? 0) > 0;
};

export const createPublicApplication = async (input: CreatePublicApplicationInput) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const applicationRes = await client.query(
      `INSERT INTO applications (job_id, org_id, candidate_name, candidate_email, candidate_phone, resume_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, job_id, status, applied_at`,
      [
        input.job_id,
        input.org_id,
        input.candidate_name,
        input.candidate_email,
        input.candidate_phone ?? null,
        input.resume_url ?? null,
      ]
    );

    const application = applicationRes.rows[0];

    for (const response of input.responses) {
      await client.query(
        `INSERT INTO app_responses (application_id, form_field_id, value, org_id)
         VALUES ($1, $2, $3, $4)`,
        [application.id, response.field_id, response.value, input.org_id]
      );
    }

    await client.query("COMMIT");
    return application;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
