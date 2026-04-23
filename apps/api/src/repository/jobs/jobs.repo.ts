import pool from "../../db/client";

type CreateJobInput = {
  title: string;
  description: string;
  jd_content: string;
};

export const jobCreation = async (data: CreateJobInput, user_id: string,  org_id: string) => {
  const res = await pool.query(
    `INSERT INTO jobs 
  (title, description, jd_content, user_id, org_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
    [data.title, data.description, data.jd_content, user_id, org_id],
  );
  return res.rows[0];
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
