<script>
    import { gradingResult, feedback } from "../stores/stores.js";
</script>

{#if $gradingResult !== null} 
    <div class="feedback-container mx-auto my-4 w-1/2 rounded-lg bg-gray-800 bg-opacity-80 p-4 shadow-lg transition duration-300 ease-in-out
        {$gradingResult === true ? 'ring-2 ring-green-500 shadow-md shadow-green-500/50' : 
        $gradingResult === false ? 'ring-2 ring-red-500 shadow-md shadow-red-500/50' : ''}">
        <h1 class="text-white font-extrabold text-2xl tracking-tight text-center">
            { $gradingResult === true ? 'Correct' : 'Incorrect' }
        </h1>
        <p class="text-slate-400 text-lg tracking-tight font-normal text-left whitespace-pre-wrap">{$feedback}</p>
    </div>
    <br>
{/if}
