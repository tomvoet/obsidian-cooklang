<script lang="ts">
    import {
        Recipe,
        type Ingredient,
        type Step,
        type Cookware,
        type Timer,
    } from "@cooklang/cooklang-ts";

    import type CookPlugin from "src/starterIndex";
    import store from "../store";
    //@ts-ignore
    import TimerComponent from "./components/Timer.svelte";

    export let source: string;

    let recipe: Recipe = new Recipe(source);

    const clean_ingredients: Ingredient[] = recipe.ingredients
        .reduce((acc, ingredient) => {
            const existing = acc.find((i) => i.name === ingredient.name);

            if (existing && existing.units === ingredient.units) {
                existing.quantity =
                    Number(existing.quantity) + Number(ingredient.quantity);
            } else {
                acc.push(ingredient);
            }

            return acc;
        }, [] as Ingredient[])
        .sort((a, b) => a.name.localeCompare(b.name));

    const clean_cookwares: Cookware[] = recipe.cookwares.sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    const timers: Timer[] = [];

    recipe.steps.forEach((step) => {
        step.forEach((substep) => {
            if (substep.type === "timer") {
                timers.push(substep);
            }
        });
    });

    let {
        plugin,
        shoppingList: { add: addIngredient },
    } = store;

    let cookPlugin: CookPlugin;
    plugin.subscribe((plugin) => {
        cookPlugin = plugin;
    });
</script>

<div class="cook-wrapper">
    {#if Object.keys(recipe.metadata).length > 0}
        <table>
            <thead>
                <tr>
                    {#each Object.keys(recipe.metadata) as field}
                        <th>{field}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {#each Object.values(recipe.metadata) as value}
                        <td>{value}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    {/if}
    {#if clean_ingredients.length > 0}
        <h2>Ingredients</h2>
        <ul class="cook-requirements-wrapper">
            {#each clean_ingredients as ingredient}
                <li on:click={() => addIngredient(ingredient)}>
                    {ingredient.quantity}
                    {ingredient.units}
                    {ingredient.name}
                </li>
            {/each}
        </ul>
    {/if}
    {#if clean_cookwares.length > 0}
        <h2>Cookware</h2>
        <ul class="cook-requirements-wrapper">
            {#each clean_cookwares as cookware}
                <li>{cookware.name}</li>
            {/each}
        </ul>
    {/if}
    {#if timers.length > 0}
        <h2>Timers</h2>
        <ul class="cook-requirements-wrapper">
            {#each timers as timer}
                <li>
                    <TimerComponent bind:duration={timer.quantity} />
                </li>
            {/each}
        </ul>
    {/if}
    <h2>Instructions</h2>
    {#each recipe.steps as step, i}
        <h3>Step {i + 1}</h3>
        {#each step as substep}
            {#if substep.type === "text"}
                {substep.value}
            {:else}
                <span class="cook-highlighted-text">
                    {substep.quantity}
                    {substep.type === "cookware" ? "" : substep.units}
                    {substep.name}
                </span>
            {/if}
        {/each}
    {/each}
</div>

<style>
    .cook-requirements-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 3fr));
    }

    .cook-highlighted-text {
        background-color: #f5f5f509;
        padding: 0.05rem;
        border-radius: 0.25rem;
    }
</style>
