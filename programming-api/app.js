import * as assignmentService from "./services/assignmentService.js";
import * as submissionService from "./services/submissionService.js";
import * as sse from "./sse/sse.js"
import { serve } from "./deps.js";
import { redis } from "./redis.js";

import { cacheMethodCalls } from "./util/cacheUtil.js";

const cachedAssignmentService = cacheMethodCalls(assignmentService, []);
const cachedSubmissionService = cacheMethodCalls(submissionService, ["submitAssignment", "gradeAssignment"]);

const streamName = "GRADING_STREAM";

const handleGrading = async (request) => {
  try {
    const submissionData = await request.json();

    if (sse.sseConnections.has(submissionData.user)) {
      return new Response(JSON.stringify({ message: 'Grading operation already in progress' }), { status: 429 });
    }

    const [submissionId, alreadyGraded, graderFeedback, correct] = await cachedSubmissionService.submitAssignment({
      uuid: submissionData.user,
      id: submissionData.programming_assignment_id,
      code: submissionData.code
    });

    if (alreadyGraded) {
      return new Response(JSON.stringify({
        submission_id: submissionId,
        already_graded: alreadyGraded,
        grader_feedback: graderFeedback,
        correct: correct
      }), { status: 200 });
    } else {
      
      const submission_id = submissionId.toString();
      const uuid = submissionData.user;
      const code = submissionData.code;
      const test_code = await cachedAssignmentService.findTestCode(submissionData.programming_assignment_id);
         
      await redis.xAdd(streamName, '*', { submission_id, uuid, code, test_code });

      return new Response(JSON.stringify({ submission_id: submissionId, already_graded: alreadyGraded }, { status: 200 }));
    }
  } catch (error) {
    console.error('Error handling grading request:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
};

const handleGradingResult = async (request) => {
  try {
  const grading_result = await request.json();
  const graded_submission = {
    programming_assignment_submission_id: grading_result.programming_assignment_submission_id,
    correct: grading_result.correct,
    grader_feedback: grading_result.grader_feedback
  }
  const uuid = grading_result.uuid;

  await cachedSubmissionService.gradeAssignment(graded_submission);

  const sseController = sse.sseConnections.get(uuid);

  if(sseController) {
    sseController.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({correct: graded_submission.correct, feedback: graded_submission.grader_feedback})}\n\n`));
    sseController.close();
    sse.removeSSEConnection(uuid);
  }
  return new Response(JSON.stringify({message: 'Graded submission received'}));
} catch (error) {
   console.log('Error with grading result: ', error)
}
};



const handleNextAssignment = async (request) => {
  try {
  const uuid = request.headers.get("user");
  if (!uuid) {
    return new Response(JSON.stringify({ error: "UUID required" }), { status: 400 });
  }
  const nextProgrammingAssignment = await cachedAssignmentService.findNextAssignment(uuid);
  if (!nextProgrammingAssignment) {
    return new Response(JSON.stringify({ error: "No next assignment found" }), { status: 404 });
  }

  const assignment = {
    id: Number(nextProgrammingAssignment.id),
    title: String(nextProgrammingAssignment.title),
    assignment_order: Number(nextProgrammingAssignment.assignment_order),
    handout: String(nextProgrammingAssignment.handout),
  }
  return new Response(JSON.stringify(assignment), { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });

  }
};


const handleAssignments = async () => {
  const programmingAssignments = await cachedAssignmentService.findAllAssignments();
  return Response.json(programmingAssignments);
};


const urlMapping = [
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/sse" }),
    fn: sse.handleSSEConnection,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/grade" }),
    fn: handleGrading,
  },
  {
    method: "POST",
    pattern: new URLPattern({ pathname: "/grade-result" }),
    fn: handleGradingResult,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/next-assignment" }),
    fn: handleNextAssignment,
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/assignments" }),
    fn: handleAssignments,
  },
];

const handleRequest = async (request) => {
  const mapping = urlMapping.find(
    (um) => um.method === request.method && um.pattern.test(request.url)
  );

  if (!mapping) {
    return new Response("Not found", { status: 404 });
  }

  const mappingResult = mapping.pattern.exec(request.url);
  try {
    return await mapping.fn(request, mappingResult);
  } catch (e) {
    console.log(e)
    return new Response(e.stack, { status: 500 })
  }
};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);