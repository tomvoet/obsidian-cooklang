<script lang="ts">
    import {
        Recipe,
        type Ingredient,
        type Cookware,
        type Timer,
    } from "@cooklang/cooklang-ts";

    import store from "../store";
    import TimerComponent from "./components/Timer.svelte";

    let { source }: { source: string } = $props();

    const {
        shoppingList: { add: addIngredient },
    } = store;

    const recipe: Recipe = $derived(new Recipe(source));

    const clean_ingredients: Ingredient[] = $derived(
        recipe.ingredients
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
            .sort((a, b) => a.name.localeCompare(b.name)),
    );

    const clean_cookwares: Cookware[] = $derived(
        recipe.cookwares.sort((a, b) => a.name.localeCompare(b.name)),
    );

    const timers: Timer[] = $derived.by(() => {
        const found: Timer[] = [];
        recipe.steps.forEach((step) => {
            step.forEach((substep) => {
                if (substep.type === "timer") {
                    found.push(substep);
                }
            });
        });
        return found;
    });
</script>

<div class="cook-wrapper">
    {#if Object.keys(recipe.metadata).length > 0}
        <table>
            <thead>
                <tr>
                    {#each Object.keys(recipe.metadata) as field (field)}
                        <th>{field}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {#each Object.values(recipe.metadata) as value, i (i)}
                        <td>{value}</td>
                    {/each}
                </tr>
            </tbody>
        </table>
    {/if}
    {#if clean_ingredients.length > 0}
        <h2>Ingredients</h2>
        <ul class="cook-requirements-wrapper">
            {#each clean_ingredients as ingredient (ingredient.name)}
                <li>
                    <button
                        type="button"
                        class="cook-list-item"
                        onclick={() => addIngredient(ingredient)}
                    >
                        {ingredient.quantity}
                        {ingredient.units}
                        {ingredient.name}
                    </button>
                </li>
            {/each}
        </ul>
    {/if}
    {#if clean_cookwares.length > 0}
        <h2>Cookware</h2>
        <ul class="cook-requirements-wrapper">
            {#each clean_cookwares as cookware (cookware.name)}
                <li>{cookware.name}</li>
            {/each}
        </ul>
    {/if}
    {#if timers.length > 0}
        <h2>Timers</h2>
        <ul class="cook-requirements-wrapper">
            {#each timers as timer, i (i)}
                <li>
                    <TimerComponent duration={Number(timer.quantity)} />
                </li>
            {/each}
        </ul>
    {/if}
    <h2>Instructions</h2>
    {#each recipe.steps as step, i (i)}
        <h3>Step {i + 1}</h3>
        {#each step as substep, j (j)}
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

    .cook-list-item {
        width: 100%;
        padding: 0;
        font: inherit;
        color: inherit;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
