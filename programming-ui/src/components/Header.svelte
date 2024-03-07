<script>
 import { points, assignment } from '../stores/stores.js';
 import { onMount } from 'svelte';
 
 onMount(() => {
    if($assignment.assignment_order == 1) {
      points.set(0);
    } else {
      points.set(($assignment.assignment_order - 1 ) * 100);
    }
  });
</script>

<nav class="fixed w-full text-center shadow-md bg-slate-800 py-4 z-50 backdrop-blur backdrop-saturate-150">
  <span class="text-white font-extrabold text-2xl tracking-tight">{$points} / 300</span>
</nav>
