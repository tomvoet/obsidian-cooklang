<script lang="ts">
  import { onDestroy } from "svelte";
  import { intervalToDuration } from "date-fns";

  let { seconds = 0 }: { seconds?: number } = $props();

  let elapsed = $state(0);
  let running = $state(false);
  let interval: ReturnType<typeof setInterval>;

  const remaining = $derived(Math.max(0, seconds - elapsed));
  const label = $derived(format(remaining));

  function format(total: number): string {
    const { hours = 0, minutes = 0, seconds: secs = 0 } = intervalToDuration({
      start: 0,
      end: total * 1000,
    });
    const pad = (n: number) => String(n).padStart(2, "0");
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
  }

  const start = () => {
    running = true;
    interval = setInterval(() => {
      if (elapsed < seconds) {
        elapsed++;
      } else {
        clearInterval(interval);
        running = false;
      }
    }, 1000);
  };

  const pause = () => {
    clearInterval(interval);
    running = false;
  };

  const reset = () => {
    pause();
    elapsed = 0;
  };

  onDestroy(() => clearInterval(interval));
</script>

<span class="inline-flex items-center gap-2">
  <span class="tabular-nums text-[var(--text-accent)] [font-family:var(--font-monospace)]">{label}</span>
  {#if running}
    <button onclick={pause}>Pause</button>
    <button onclick={reset}>Reset</button>
  {:else}
    <button onclick={start}>Start</button>
  {/if}
</span>
