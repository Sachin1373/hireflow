import pool from "../../db/client";

export const CreateOrganization = async (name: string) => {
  const res = await pool.query(
    `INSERT INTO organizations (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return res.rows[0];
};

export const GetOrganizationById = async (id: string) => {
  const res = await pool.query(`SELECT * FROM organizations WHERE id = $1`, [id]);
  return res.rows[0];
};
