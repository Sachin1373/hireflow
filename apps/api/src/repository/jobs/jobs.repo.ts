import pool from "../../db/client";
import crypto from "crypto";

type CreateJobInput = {
  title: string;
  description: string;
  jd_content: string;
};

type UpdateJobInput = Partial<CreateJobInput> & {
  status?: string;
  form_expires_at?: string | null;
  exp?: string | null;
};

type AssignJobReviewersResult = {
  assignedCount: number;
};

export const getJobStatusById = async (id: string, org_id: string) => {
  const res = await pool.query(
    "SELECT id, status FROM jobs WHERE id = $1 AND org_id = $2",
    [id, org_id]
  );
  return res.rows[0] || null;
};

export const jobCreation = async (data: CreateJobInput, user_id: string,  org_id: string) => {
  const slug = `job_${crypto.randomBytes(12).toString("hex")}`;
  const res = await pool.query(
    `INSERT INTO jobs 
  (title, description, jd_content, user_id, org_id, slug)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;`,
    [data.title, data.description, data.jd_content, user_id, org_id, slug],
  );
  return res.rows[0];
};

export const updateJob = async (id: string, data: UpdateJobInput, org_id: string) => {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (data.title) {
    fields.push(`title = $${index}`);
    values.push(data.title);
    index++;
  }
  if (data.description !== undefined) {
    fields.push(`description = $${index}`);
    values.push(data.description);
    index++;
  }
  if (data.jd_content !== undefined) {
    fields.push(`jd_content = $${index}`);
    values.push(data.jd_content);
    index++;
  }
  if (data.status !== undefined) {
    fields.push(`status = $${index}`);
    values.push(data.status);
    index++;
  }

  const expiresAt = data.form_expires_at !== undefined ? data.form_expires_at : data.exp;
  if (expiresAt !== undefined) {
    fields.push(`form_expires_at = $${index}`);
    values.push(expiresAt);
    index++;
  }

  if (fields.length === 0) return null;

  values.push(id, org_id);
  const query = `UPDATE jobs SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} AND org_id = $${index + 1} RETURNING *`;
  
  const res = await pool.query(query, values);
  return res.rows[0];
};

export const deleteJob = async (id: string, org_id: string) => {
  const res = await pool.query(
    "DELETE FROM jobs WHERE id = $1 AND org_id = $2 RETURNING id",
    [id, org_id]
  );
  return res.rows[0] || null;
};


export const getAllJobs = async (org_id: string, page: number = 1, limit: number = 10, search: string = "") => {
  const offset = (page - 1) * limit;
  let baseQuery = `FROM jobs WHERE org_id = $1`;
  const values: any[] = [org_id];

  if (search) {
    baseQuery += ` AND (title ILIKE $2 OR description ILIKE $2)`;
    values.push(`%${search}%`);
  }

  const countRes = await pool.query(`SELECT COUNT(*) ${baseQuery}`, values);
  const total = parseInt(countRes.rows[0].count, 10);

  const query = `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  const res = await pool.query(query, [...values, limit, offset]);

  return { jobs: res.rows, total, page, limit };
}

export const getJobById = async (id: string, org_id: string) => {
  const jobRes = await pool.query('SELECT * FROM jobs WHERE id = $1 AND org_id = $2', [id, org_id]);
  if (jobRes.rows.length === 0) return null;

  const job = jobRes.rows[0];

  // Fetch form fields
  const fieldsRes = await pool.query('SELECT * FROM form_fields WHERE job_id = $1 ORDER BY position ASC', [id]);
  job.fields = fieldsRes.rows;

  // Fetch reviewers (linked via reviewer_links, joining with users)
  // Assuming reviewer_links points to users table via reviewer_id for now as per my analysis
  const reviewersRes = await pool.query(
    `SELECT u.id, u.first_name as name, u.email, u.designation 
     FROM reviewer_links rl
     JOIN users u ON rl.reviewer_id = u.id
     WHERE rl.job_id = $1`,
    [id]
  );
  job.reviewers = reviewersRes.rows;

  return job;
}

export const assignJobReviewers = async (
  jobId: string,
  reviewerIds: string[],
  org_id: string
): Promise<AssignJobReviewersResult> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const jobRes = await client.query(
      "SELECT 1 FROM jobs WHERE id = $1 AND org_id = $2",
      [jobId, org_id]
    );

    if (jobRes.rowCount === 0) {
      throw new Error("Job not found");
    }

    const uniqueReviewerIds = [...new Set(reviewerIds)];

    if (uniqueReviewerIds.length > 0) {
      const reviewersRes = await client.query(
        `SELECT id
         FROM users
         WHERE org_id = $1
           AND role = 'REVIEWER'
           AND id = ANY($2::uuid[])`,
        [org_id, uniqueReviewerIds]
      );

      if (reviewersRes.rowCount !== uniqueReviewerIds.length) {
        throw new Error("One or more reviewers are invalid");
      }
    }

    await client.query(
      "DELETE FROM reviewer_links WHERE job_id = $1 AND org_id = $2",
      [jobId, org_id]
    );

    if (uniqueReviewerIds.length > 0) {
      await client.query(
        `INSERT INTO reviewer_links (job_id, reviewer_id, org_id)
         SELECT $1, unnest($2::uuid[]), $3`,
        [jobId, uniqueReviewerIds, org_id]
      );
    }

    await client.query("COMMIT");
    return { assignedCount: uniqueReviewerIds.length };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getPublicJobBySlug = async (slug: string) => {
  const jobRes = await pool.query(
    `SELECT id, org_id, title, description, jd_content, form_expires_at, status
     FROM jobs
     WHERE slug = $1`,
    [slug]
  );

  if (jobRes.rowCount === 0) {
    return null;
  }

  const job = jobRes.rows[0];
  const fieldsRes = await pool.query(
    `SELECT id, field_type, label, required, position, options, placeholder
     FROM form_fields
     WHERE job_id = $1
     ORDER BY position ASC`,
    [job.id]
  );

  return {
    ...job,
    fields: fieldsRes.rows,
  };
};

export const getJobMetaData = async(job_id: string) => {
  const res = await pool.query('SELECT * FROM jobs WHERE id = $1', [job_id])

  return res.rows[0]
}

