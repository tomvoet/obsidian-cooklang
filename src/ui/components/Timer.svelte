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

<div class="cook-timer">
  <div class="cook-timer-time">
    {seconds - timer}
  </div>
  <div class="cook-timer-controls">
    {#if timerRunning}
      <button onclick={pauseTimer}>Pause</button>
      <button onclick={resetTimer}>Reset</button>
    {:else}
      <button onclick={startTimer}>Start</button>
    {/if}
  </div>
</div>

<style>
  * {
    box-sizing: border-box;
  }
  .cook-timer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    padding: 10px;
    width: max-content;
  }

  .cook-timer-time {
    font-size: 1.5rem;
  }

  .cook-timer-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .cook-timer-controls button {
    margin-left: 10px;
  }
</style>
