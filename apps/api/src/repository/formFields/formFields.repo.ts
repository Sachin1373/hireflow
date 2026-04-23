import pool from "../../db/client";

export type FormFieldInput = {
  field_type: string;
  label: string;
  required: boolean;
};

export const createFormFields = async (org_id:  string, job_id: string, fields: FormFieldInput[]) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query('DELETE FROM form_fields WHERE job_id = $1', [job_id]);

    const insertedFields = [];
    for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        const res = await client.query(
            `INSERT INTO form_fields (org_id, job_id, field_type, label, required, position)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
            [org_id, job_id, f.field_type, f.label, f.required || false, i]
        );
        insertedFields.push(res.rows[0]);
    }

    await client.query('COMMIT');
    return insertedFields;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getFormFieldsByJobId = async (job_id: string) => {
  const res = await pool.query('SELECT * FROM form_fields WHERE job_id = $1 ORDER BY position ASC', [job_id]);
  return res.rows;
};
