import { grade } from "./services/gradingService.js";
import { redis, waitForRedis } from "./redis.js";
const apiGatewayUrl = Deno.env.get("API_GATEWAY_URL");

const STREAM_WAIT_TIME = 5000
const EVENT_IDLE_TIME = 600000

const streamName = "GRADING_STREAM";
const streamGroup = "GRADING_GROUP";
const consumerName = `grader-${Math.random().toString(16).slice(2)}`;

await waitForRedis();
await createConsumerGroup();
await removeIdleConsumers();

while(true) {
  try {
    let event = await claimPendingSubmission();

    if(event === null) {
      event = await readSubmissionFromStream();
    }

    if(event === null) {
      continue
    }

    const id = event.id;
    const submission_id = event.message.submission_id;
    const uuid =  event.message.uuid;
    const code = event.message.code;
    const test_code = event.message.test_code;
    console.log("Grader-api received code: ", code);
    console.log("Grader-api received test code: ", test_code);

    const result = await grade(code, test_code)
    const correct = result.charAt(0) === '.';
    const gradeResult = {
      programming_assignment_submission_id: submission_id,
      uuid: uuid,
      correct: correct,
      grader_feedback: result
    };
    
    await fetch(`${apiGatewayUrl}/api/grade-result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gradeResult)
    });

    await acknowledgeMessage(id);

    console.log(`Message ${id} acknowledged!`)
    } catch (error) {
      console.log("Error reading from stream", error);
    }
}

async function createConsumerGroup() {
  try {
    await redis.xGroupCreate(streamName, streamGroup, '$', { MKSTREAM: true })
  } catch(error) {
    if (error.message !== "BUSYGROUP Consumer Group name already exists") throw error
    console.log("Consumer group already exists, skipping creation")
  }
}

async function removeIdleConsumers() {
  const consumers = await redis.xInfoConsumers(streamName, streamGroup)
  for (const consumer of consumers) {
    if (consumer.pending === 0) {
      await redis.xGroupDelConsumer(streamName, streamGroup, consumer.name)
    }
  }
}

async function claimPendingSubmission() {
  const response = await redis.xAutoClaim(streamName, streamGroup, consumerName, EVENT_IDLE_TIME, '-', { COUNT: 1 })
  return response.messages.length === 0 ? null : response.messages[0]
}

async function readSubmissionFromStream() {
  const response = await redis.xReadGroup(streamGroup, streamName, [
    { key: streamName, id: '>' }
  ], {
    COUNT: 1,
  })

  return response === null ? null : response[0].messages[0]
}

async function acknowledgeMessage(id) {
  await redis.xAck(streamName, streamGroup, id)
}