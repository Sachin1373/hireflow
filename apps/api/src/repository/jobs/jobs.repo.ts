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
