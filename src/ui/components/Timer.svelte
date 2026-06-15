<script lang="ts">
  import { onDestroy } from "svelte";

  let { seconds = 0 }: { seconds?: number } = $props();

  let timer = $state(0);
  let timerRunning = $state(false);
  let timerInterval: ReturnType<typeof setInterval>;

  const startTimer = () => {
    timerRunning = true;
    timerInterval = setInterval(() => {
      if (timer < seconds) {
        timer++;
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerInterval);
    timerRunning = false;
  };

  const resetTimer = () => {
    pauseTimer();
    timer = 0;
  };

  onDestroy(() => {
    clearInterval(timerInterval);
  });
</script>

<div class="flex w-max items-center justify-center rounded-[5px] p-2.5">
  <div class="text-2xl">
    {seconds - timer}
  </div>
  <div class="flex items-center justify-center">
    {#if timerRunning}
      <button class="ml-2.5" onclick={pauseTimer}>Pause</button>
      <button class="ml-2.5" onclick={resetTimer}>Reset</button>
    {:else}
      <button class="ml-2.5" onclick={startTimer}>Start</button>
    {/if}
  </div>
</div>
