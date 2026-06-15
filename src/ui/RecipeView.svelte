<script lang="ts">
  import {
    Parser,
    grouped_quantity_display,
    ingredient_display_name,
    cookware_display_name,
    quantity_display,
    timerSeconds,
    type Item,
  } from "../cooklang";
  import TimerComponent from "./components/Timer.svelte";
  import { upperFirst } from "scule";

  let { source }: { source: string } = $props();

  const parser = new Parser();
  const parsed = $derived.by(() => parser.parse(source));

  const ingredients = $derived.by(() =>
    parser.group_ingredients(parsed).map(({ index, quantity }) => ({
      name: ingredient_display_name(parsed.recipe.ingredients[index]),
      display: grouped_quantity_display(quantity),
    })),
  );

  const cookware = $derived.by(() =>
    parser.group_cookware(parsed).map(({ index, quantity }) => ({
      name: cookware_display_name(parsed.recipe.cookware[index]),
      display: grouped_quantity_display(quantity),
    })),
  );

  const timers = $derived.by(() =>
    parsed.recipe.timers.map((timer) => ({
      name: timer.name,
      seconds: timerSeconds(timer.quantity),
    })),
  );

  const metaData = $derived.by(
    () => [
      ...Object.entries(parsed.metadata).filter(([key, _]) => key !== "custom"),
      ...Object.entries(parsed.metadata.custom),
    ]
      .filter(([_, value]) => !!value)
      .map(([key, value]) => ({ key: upperFirst(key), value })),
  );

  // Step items reference ingredients/cookware/timers by index into the recipe.
  function itemText(item: Item): string {
    switch (item.type) {
      case "ingredient": {
        const ing = parsed.recipe.ingredients[item.index];
        const qty = ing.quantity ? quantity_display(ing.quantity) : "";
        return `${qty} ${ingredient_display_name(ing)}`.trim();
      }
      case "cookware": {
        const cw = parsed.recipe.cookware[item.index];
        const qty = cw.quantity ? quantity_display(cw.quantity) : "";
        return `${qty} ${cookware_display_name(cw)}`.trim();
      }
      case "timer": {
        const t = parsed.recipe.timers[item.index];
        const qty = t.quantity ? quantity_display(t.quantity) : "";
        return `${t.name ?? ""} ${qty}`.trim();
      }
      case "inlineQuantity":
        return quantity_display(parsed.recipe.inline_quantities[item.index]);
      default:
        return "";
    }
  }
</script>

<div class="cook-wrapper">
  {#if Object.keys(parsed.metadata).length > 0}
    <table>
      <thead>
        <tr>
          {#each metaData as { key } (key)}
            <th>{key}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        <tr>
          {#each metaData as { value }, i (i)}
            <td>{value}</td>
          {/each}
        </tr>
      </tbody>
    </table>
  {/if}
  {#if ingredients.length > 0}
    <h2>Ingredients</h2>
    <ul class="cook-requirements-wrapper">
      {#each ingredients as ingredient (ingredient.name)}
        <li>{ingredient.display} {ingredient.name}</li>
      {/each}
    </ul>
  {/if}
  {#if cookware.length > 0}
    <h2>Cookware</h2>
    <ul class="cook-requirements-wrapper">
      {#each cookware as item (item.name)}
        <li>{item.display} {item.name}</li>
      {/each}
    </ul>
  {/if}
  {#if timers.length > 0}
    <h2>Timers</h2>
    <ul class="cook-requirements-wrapper">
      {#each timers as timer, i (i)}
        <li>
          {#if timer.name}<span class="cook-timer-name">{timer.name}</span>{/if}
          <TimerComponent seconds={timer.seconds} />
        </li>
      {/each}
    </ul>
  {/if}
  <h2>Instructions</h2>
  {#each parsed.recipe.sections as section, s (s)}
    {#if section.name}
      <h3>{section.name}</h3>
    {/if}
    {#each section.content as content, c (c)}
      {#if content.type === "step"}
        <h3>Step {content.value.number}</h3>
        <p>
          {#each content.value.items as item, k (k)}
            {#if item.type === "text"}
              {item.value}
            {:else}
              <span class="bg-zinc-500/20 rounded-sm px-px">{itemText(item)}</span>
            {/if}
          {/each}
        </p>
      {:else}
        <p>{content.value}</p>
      {/if}
    {/each}
  {/each}
</div>

<style>
  .cook-requirements-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 3fr));
  }
</style>
