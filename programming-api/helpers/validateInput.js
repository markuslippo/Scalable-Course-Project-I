import * as assignmentService from "../services/assignmentService.js";

const validateGradingInput = async ({uuid, id, code}) => {
  const errors = [];

  if (!uuid || typeof uuid !== 'string') 
    errors.push("UUID is required and must be a string");

  if (!id || typeof id !== 'number' ) 
    errors.push("ID is required and must be a number");

  if (!code || typeof code !== 'string') 
    errors.push("Code is required and must be a string");

  const exists = assignmentService.checkAssignmentExists(id);
  if(!exists)
    return new Response(JSON.stringify({ error: 'No assignment for id' }), { status: 404 });

  if (errors.length > 0) {
    return  new Response(JSON.stringify({ errors: errors }), { status: 400 });
  }
  return null;
};

const validateGradingResultInput = async({programming_assignment_submission_id, uuid, correct, grader_feedback}) => {
    const errors = [];

  if (!programming_assignment_submission_id || typeof programming_assignment_submission_id !== 'number') 
    errors.push("Programming_assignment_id should be a number");

  if (!uuid || typeof uuid !== 'string' ) 
    errors.push("UUID is required and must be a string");

  if (!correct || typeof code !== 'boolean') 
    errors.push("Correct is required and must be a boolean");

  if (!grader_feedback || typeof grader_feedback !== 'string' ) 
    errors.push("Grader_feedback is required and must be a string");

  if (errors.length > 0) {
    return  new Response(JSON.stringify({ errors: errors }), { status: 400 });
  }
  return null;
}


const validateUUID = async ({uuid}) => {
    const errors = [];
  
    if(!uuid || typeof uuid !== 'string' )
        errors.push("UUID is required and must be a string");
    
    if(errors.length > 0) {
        return new Response(JSON.stringify({ errors: errors}), { status: 400 });
    }
  };

export { validateGradingInput, validateUUID, validateGradingResultInput };
