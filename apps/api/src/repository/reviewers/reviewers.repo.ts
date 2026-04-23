import pool from "../../db/client"

type CreateReviewerInput = {
  name: string;
  email: string;
  designation?: string;
  created_by: string;
  org_id: string;
  password?: string;
};
type GetReviewersInput = {
  page: number;
  limit: number;
  search?: string;
  org_id: string;
};
export const CreateReviewerService = async(data: CreateReviewerInput) => {
    const { name, email, designation, created_by, org_id, password } = data;
    const res = await pool.query(
      `
      INSERT INTO users (first_name, email, designation, created_by, org_id, role, password_hash)
      VALUES ($1, $2, $3, $4, $5, 'REVIEWER', $6)
      RETURNING *, first_name as name;
      `,
      [name, email, designation || null, created_by, org_id, password || null]
    );

    return res.rows[0];
}


export const checkReviewerAlreadyExists = async(email: string):Promise<boolean> => {
    const res = await pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists", [email])

    return res.rows[0].exists
}

export const getReviewers = async ({
  page,
  limit,
  search,
  org_id,
}: GetReviewersInput) => {
 
  const offset = (page - 1) * limit;
  let baseQuery = `
    FROM users
    WHERE org_id = $1 AND role = 'REVIEWER'
  `;

  const values: any[] = [org_id];
  let index = 2;

  // 🔍 search filter
  if (search) {
    baseQuery += `
      AND (first_name ILIKE $${index} OR email ILIKE $${index})
    `;
    values.push(`%${search}%`);
    index++;
  }

  const countRes = await pool.query(
    `SELECT COUNT(*) ${baseQuery}`,
    values
  );

  const total = Number(countRes.rows[0].count);

  const dataQuery = `
    SELECT id, first_name as name, email, designation, created_at
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

export const DeleteReviewerService = async (id: string) => {
  const res = await pool.query(
    "DELETE FROM users WHERE id = $1 AND role = 'REVIEWER' RETURNING *",
    [id]
  );
  return res.rows[0];
};

export const AssignReviewersToJob = async (jobId: string, reviewerIds: string[], org_id: string) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Clear existing links
    await client.query('DELETE FROM reviewer_links WHERE job_id = $1', [jobId]);

    // Insert new links
    for (const rid of reviewerIds) {
      await client.query(
        'INSERT INTO reviewer_links (job_id, reviewer_id, org_id) VALUES ($1, $2, $3)',
        [jobId, rid, org_id]
      );
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};