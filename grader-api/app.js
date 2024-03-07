import { grade } from "./services/gradingService.js";
import { createClient } from "npm:redis@4.6.4";
const DEBUG = false

const client = createClient({
  url: "redis://redis:6379",
  pingInterval: 1000,
});

await client.connect();


await client.subscribe(
  "gradingQueue",
  async (message, channel) => { 
    try {
      const data = JSON.parse(message);
      const result = await grade(data.code, data.test_code);
      
      if(DEBUG) {
        console.log("\n########################");
        console.log("Grader received payload: ", data);
        console.log(`Grading is correct: ${result.charAt(0) === '.'}`);
        console.log("Grader feedback: ", result);
        console.log("########################\n");
      }
      
      const correct = result.charAt(0) === '.';
      const grade_result = {
        programming_assignment_submission_id: data.submission_id,
        uuid: data.uuid,
        correct: correct,
        grader_feedback: result
      };

      const response = await fetch("http://project1-nginx-1:7800/api/grade-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(grade_result)
      })

      if(DEBUG) {
        if (!response.ok) {
          console.error('Failed to submit for grading');
          alert('Failed to submit for grading');
          return;
        }
    }

    } catch (error) {
      console.error("Error with grading assignment:", error);
    }
  }
);