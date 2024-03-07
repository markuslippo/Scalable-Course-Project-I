import { sql } from "../database/database.js";

const submitAssignment = async ({uuid, id, code}) => {
  /* 
      For submitting the assignment to the database. 
      If an assignment with the same code and status='processed' exists, we copy the grader_feedback and correct values. 
      If an existing submission doesn't exist, we create a new submission.
  */

  try {
    const existingSubmission = await sql`
    SELECT id, status, grader_feedback, correct 
    FROM programming_assignment_submissions
    WHERE code = ${code} AND status = 'processed' AND programming_assignment_id = ${id}
    LIMIT 1`.then(result => result[0]);
  
    let submission_id;
    let already_graded = false;
  
    if(existingSubmission) {
      already_graded = true;

      const newGradedSubmission = await sql`
      INSERT INTO programming_assignment_submissions 
      (programming_assignment_id, code, user_uuid, status, grader_feedback, correct) 
      VALUES
      (${id}, ${code}, ${uuid}, ${existingSubmission.status},  ${existingSubmission.grader_feedback},  ${existingSubmission.correct})
      RETURNING id`;
      
      submission_id = newGradedSubmission[0].id;
      
    } else {
      const newSubmission = await sql`
      INSERT INTO programming_assignment_submissions 
      (programming_assignment_id, code, user_uuid, status) 
      VALUES
      (${id}, ${code}, ${uuid}, 'pending')
      RETURNING id`;
  
      submission_id = newSubmission[0].id;
    }
  
    return already_graded ?  [submission_id, already_graded, existingSubmission.grader_feedback, existingSubmission.correct] : [submission_id, already_graded]

  } catch(error) {
      console.log("Submitting assignment failed due to an error: ", error);
    }
  }
  


  const gradeAssignment = async (graded_submission) => {
    await sql`
    UPDATE programming_assignment_submissions 
    SET status = 'processed', grader_feedback = ${graded_submission.grader_feedback}, correct = ${graded_submission.correct}
    WHERE id = ${graded_submission.programming_assignment_submission_id}`;
}

export { submitAssignment, gradeAssignment };
