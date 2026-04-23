import pool from "../../db/client";

export type CreateUserInput = {
  first_name: string;
  last_name?: string;
  email: string;
  role: string;
  password?: string;
  designation?: string;
  org_id: string;
  created_by?: string;
  permissions?: {
    read: boolean;
    write: boolean;
  };
};

export const CreateUser = async (data: CreateUserInput) => {
  const { first_name, last_name, email, role, password, org_id, created_by, permissions } = data;

  const res = await pool.query(
    `INSERT INTO users (first_name, last_name, email, role, password_hash, org_id, created_by, permissions)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, email, role, org_id, permissions`,
    [
        first_name, 
        last_name || '', 
        email, 
        role, 
        password || null, 
        org_id, 
        created_by || null, 
        permissions ? JSON.stringify(permissions) : JSON.stringify({ read: true, write: false })
    ],
  );

  return res.rows[0];
};

export const CheckUserExists = async (email: string): Promise<boolean> => {
  const res = await pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists", [
    email,
  ]);

  return res.rows[0].exists;
};

export const GetUserByEmail = async(email:string) => {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    return res.rows[0];
}

export const UpdateUser = async (id: string, org_id: string, data: Partial<CreateUserInput>) => {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (data.first_name) {
    fields.push(`first_name = $${index}`);
    values.push(data.first_name);
    index++;
  }
  if (data.last_name !== undefined) {
    fields.push(`last_name = $${index}`);
    values.push(data.last_name);
    index++;
  }
  if (data.email) {
    fields.push(`email = $${index}`);
    values.push(data.email);
    index++;
  }
  if (data.role) {
    fields.push(`role = $${index}`);
    values.push(data.role);
    index++;
  }
  if (data.designation !== undefined) {
    fields.push(`designation = $${index}`);
    values.push(data.designation);
    index++;
  }
  if (data.permissions) {
    fields.push(`permissions = $${index}`);
    values.push(JSON.stringify(data.permissions));
    index++;
  }

  if (fields.length === 0) return null;

  values.push(id, org_id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index} AND org_id = $${index + 1} RETURNING id, first_name, email, role, org_id, permissions, designation`;

  const res = await pool.query(query, values);
  return res.rows[0];
};

export const GetUserById = async(id:string) => {
    const res = await pool.query("SELECT id, first_name, email, role, org_id, permissions FROM users WHERE id = $1", [id])

    return res.rows[0];
}

export const GetOrgUsersRepo = async (org_id: string, page: number = 1, limit: number = 10, search: string = "") => {
  const offset = (page - 1) * limit;
  let baseQuery = `
     FROM users 
     WHERE org_id = $1 AND role IN ('ADMIN', 'HR')
  `;
  const values: any[] = [org_id];

  if (search) {
    baseQuery += ` AND (first_name ILIKE $2 OR last_name ILIKE $2 OR email ILIKE $2)`;
    values.push(`%${search}%`);
  }

  const countRes = await pool.query(`SELECT COUNT(*) ${baseQuery}`, values);
  const total = parseInt(countRes.rows[0].count, 10);

  const query = `
     SELECT id, first_name, last_name, email, role, permissions, created_at 
     ${baseQuery}
     ORDER BY created_at DESC 
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;
  const res = await pool.query(query, [...values, limit, offset]);

  return { users: res.rows, total, page, limit };
};

export const DeleteUserRepo = async (id: string, org_id: string) => {
  const res = await pool.query(
    "DELETE FROM users WHERE id = $1 AND org_id = $2 RETURNING id",
    [id, org_id]
  );
  return res.rows[0] || null;
};
