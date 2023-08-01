<script lang="ts" type="module">
    import { onDestroy } from "svelte";

    export let duration: number = 0;
    duration *= 60;

    let timer: number = 0;
    let timerRunning: boolean = false;

    let timerInterval: number;

    const startTimer = () => {
        timerRunning = true;
        timerInterval = setInterval(() => {
            if (timer < duration) {
                timer++;
            } else {
                clearInterval(timerInterval);
                timerRunning = false;
            }
        }, 1000);
    };

    onDestroy(() => {
        clearInterval(timerInterval);
    });
</script>

<div class="cook-timer">
    <div class="cook-timer-time">
        {duration - timer}
    </div>
    <div class="cook-timer-controls">
        {#if timerRunning}
            <button on:click={() => {
                clearInterval(timerInterval);
                timerRunning = false;
            }}>
                Pause
            </button>
            <button on:click={() => {
                clearInterval(timerInterval);
                timerRunning = false;
                timer = 0;
            }}>
                Reset
            </button>
        {:else}
            <button on:click={startTimer}>
                Start
            </button>
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