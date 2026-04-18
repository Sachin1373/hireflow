import pool from "../../db/client";

export type CreateUserInput = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  password: string;
};

export const CreateUser = async (data: CreateUserInput) => {
  const { first_name, last_name, email, role, password } = data;

  const res = await pool.query(
    `INSERT INTO users (first_name, last_name, email, role, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email`,
    [first_name, last_name, email, role, password],
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

export const GetUserById = async(id:string) => {
    const res = await pool.query("SELECT id, first_name, email, role FROM users WHERE id = $1", [id])

    return res.rows[0];
}
