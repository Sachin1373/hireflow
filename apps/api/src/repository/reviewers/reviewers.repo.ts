import pool from "../../db/client"

type CreateReviewerInput = {
  name: string;
  email: string;
  designation?: string;
  created_by: string;
};

type GetReviewersInput = {
  page: number;
  limit: number;
  search?: string;
};


export const CreateReviewerService = async(data: CreateReviewerInput) => {
    const { name, email, designation, created_by } = data;
    const res = await pool.query(
      `
      INSERT INTO reviewers (name, email, designation, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [name, email, designation || null, created_by]
    );

    return res.rows[0];
}


export const checkReviewerAlreadyExists = async(email: string):Promise<boolean> => {
    const res = await pool.query("SELECT EXISTS (SELECT 1 FROM reviewers WHERE email = $1) AS exists", [email])

    return res.rows[0].exists
}

export const getReviewers = async ({
  page,
  limit,
  search,
}: GetReviewersInput) => {
 
  const offset = (page - 1) * limit;
  let baseQuery = `
    FROM reviewers
    WHERE 1=1
  `;

  const values: any[] = [];
  let index = 1;

  // 🔍 search filter
  if (search) {
    baseQuery += `
      AND (name ILIKE $${index} OR email ILIKE $${index})
    `;
    values.push(`%${search}%`);
    index++;
  }

  // 📊 total count
  const countRes = await pool.query(
    `SELECT COUNT(*) ${baseQuery}`,
    values
  );

  const total = Number(countRes.rows[0].count);

  // 📄 paginated data
  const dataQuery = `
    SELECT *
    ${baseQuery}
    ORDER BY created_at DESC
    LIMIT $${index} OFFSET $${index + 1}
  `;

  values.push(limit, offset);

  const dataRes = await pool.query(dataQuery, values);

  return {
    data: dataRes.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};