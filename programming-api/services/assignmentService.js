import { sql } from "../database/database.js";

const findAllAssignments = async () => {
  return await sql`
  SELECT * 
  FROM programming_assignments;`;
};


const findNextAssignment = async (uuid) => {
  const result = await sql`
  SELECT pa.*
  FROM programming_assignments pa
  WHERE NOT EXISTS (
  SELECT 1
  FROM programming_assignment_submissions pas
  WHERE pas.programming_assignment_id = pa.id
    AND pas.user_uuid = ${uuid}
    AND pas.correct = TRUE
  )
  ORDER BY pa.assignment_order ASC
  LIMIT 1;
`
  return result[0];
}

const findTestCode = async (id) => {
  return await sql`
  SELECT test_code
  FROM programming_assignments
  WHERE id = ${id}`.then(result => result[0].test_code);
}

const checkAssignmentExists = async (id) => {
  const result = await sql`
    SELECT 1
    FROM programming_assignments
    WHERE id = ${id}
    LIMIT 1`.then(result => result.length > 0);
  return result;
};

export { findAllAssignments, findNextAssignment, findTestCode, checkAssignmentExists };
