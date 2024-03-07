<script>
  import { userUuid, assignment, pending, gradingResult, points, feedback } from "../stores/stores.js";
  import { onMount } from "svelte";

  let eventSource;
  let code = '# Start writing your code here.';

  const gradeAssignment = async () => {
    pending.set(true);
    
    feedback.set('');
    gradingResult.set(null);

    const submission = {
      user: $userUuid,
      code: code,
      programming_assignment_id: $assignment.id,
    };

    try {
    const response = await fetch("/api/grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submission),
    });

    const response_data = await response.json();


    if (response.status === 429 ) {
      alert("Submission already in grading")
      pending.set(false);
    }
    else if (response_data.already_graded) {
      feedback.set(response_data.grader_feedback);
      gradingResult.set(response_data.correct);
      pending.set(false);
    } else {
      eventSource = new EventSource(`/api/sse?uuid=${$userUuid}`);
      eventSource.onmessage = (event) => {
        const graded_submission = JSON.parse(event.data);
        feedback.set(graded_submission.feedback)
        gradingResult.set(graded_submission.correct); 
        eventSource.close();
        pending.set(false);
      }
      eventSource.onerror = (error) => {
        eventSource.close();
        pending.set(false);
      }
    }
    } catch (error) {
      console.log("Error during grading: ", error);
    } 
  };
  

  const nextAssignment = async () => {
    try {
      const response = await fetch("/api/next-assignment", {
        method: "GET",
        headers: {
          "user": $userUuid, 
        },
      });
      if (response.ok) {
        const data = await response.json();
        assignment.set(data);
        gradingResult.set(null);
        code = '# Start writing your code here.';
        feedback.set('');
      } else {
        console.error('Failed to fetch assignment:', response.statusText);
      }

    } catch (error) {
      console.error('There was a problem with fetch operation:', error);
    } 
  };
  
  onMount(() => {
    nextAssignment();
    pending.set(false);
    gradingResult.set(null);
  });

</script>


<div class="relative m-2.5 p-5 text-white text-center font-extrabold">
  <textarea bind:value="{code}"
          class="font-normal min-h-[150px] mx-4 my-4 h-80 w-1/2 resize-y rounded-lg bg-gray-800 bg-opacity-80 p-4 font-mono text-white shadow-lg transition duration-300 ease-in-out 
          focus:outline-none 
          {$gradingResult === true ? 'ring-2 ring-green-500 shadow-md shadow-green-500/50' : 
           $gradingResult === false ? 'ring-2 ring-red-500 shadow-md shadow-red-500/50' : 
           $pending ? 'ring-2 ring-gray-500 shadow-md shadow-gray-500/50' : ''}"
  />
  <div class="flex justify-center mt-4">
    {#if $gradingResult === true}
      {#if $assignment.assignment_order == 3 && $gradingResult === true}
      <h1 class="text-white font-extrabold text-2xl tracking-tight text-center">
        All done
      </h1>
      {:else}
        <button class="rounded bg-green-500 px-4 py-2 text-white focus:outline-none focus:ring focus:ring-green-300 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105" 
          on:click="{nextAssignment}">
          Next assignment
        </button>
      {/if}
    {:else}
    <button class="rounded px-4 py-2 text-white focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ease-in-out
    {$pending ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-400 hover:scale-105 transform'}"
    on:click="{gradeAssignment}" 
    disabled="{$pending}">
    Submit
    </button>
    {/if}
  </div>
</div>

