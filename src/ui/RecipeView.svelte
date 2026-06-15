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

  const title = $derived(parsed.metadata.title);
  const description = $derived(parsed.metadata.description);

  const SKIP_META = new Set(["title", "description", "custom", "images", "locale"]);

  const meta = $derived.by(() =>
    [
      ...Object.entries(parsed.metadata).filter(([key]) => !SKIP_META.has(key)),
      ...Object.entries(parsed.metadata.custom ?? {}),
    ]
      .map(([key, value]) => ({ key: upperFirst(key), value: formatMeta(value) }))
      .filter(({ value }) => value !== ""),
  );

  function formatMeta(value: unknown): string {
    if (value == null) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") {
      const name = (value as Record<string, unknown>).name;
      return typeof name === "string" ? name : "";
    }
    return String(value);
  }

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

  function tokenClass(type: Item["type"]): string {
    switch (type) {
      case "cookware":
        return "rounded-[var(--radius-s)] px-1 py-0.5 font-medium text-[var(--text-normal)] bg-[var(--background-modifier-hover)]";
      case "timer":
        return "rounded-[var(--radius-s)] px-1 py-0.5 font-medium text-[var(--text-normal)] bg-[var(--background-modifier-hover)] [font-family:var(--font-monospace)]";
      default:
        return "rounded-[var(--radius-s)] px-1 py-0.5 font-medium text-[var(--text-accent)] bg-[color-mix(in_srgb,var(--text-accent)_12%,transparent)]";
    }
  }
</script>

<article
  class="cook-recipe flex flex-col gap-5 rounded-(--radius-l) border border-(--background-modifier-border) p-5 text-(--text-normal)"
>
  {#if title || description || meta.length > 0}
    <header class="flex flex-col gap-2">
      {#if title}
        <div class="text-2xl font-semibold leading-tight">{title}</div>
      {/if}
      {#if description}
        <div class="text-(--text-muted)">{description}</div>
      {/if}
      {#if meta.length > 0}
        <div class="flex flex-wrap gap-1.5">
          {#each meta as m, i (i)}
            <span class="rounded-full bg-(--background-secondary) px-2.5 py-0.5 text-sm">
              <span class="text-(--text-muted)">{m.key}</span>
              <span>{m.value}</span>
            </span>
          {/each}
        </div>
      {/if}
    </header>
  {/if}

  {#if ingredients.length > 0 || cookware.length > 0}
    <div class="grid gap-x-8 gap-y-5 border-t border-(--background-modifier-border) pt-5 sm:grid-cols-2">
      {#if ingredients.length > 0}
        <section>
          <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Ingredients</div>
          <div role="list">
            {#each ingredients as ingredient, i (i)}
              <div
                role="listitem"
                class="flex justify-between gap-3 border-b border-(--background-modifier-border) py-1 last:border-0"
              >
                <span>{ingredient.name}</span>
                {#if ingredient.display}
                  <span class="shrink-0 font-medium tabular-nums text-(--text-accent)">{ingredient.display}</span>
                {/if}
              </div>
            {/each}
          </div>
        </section>
      {/if}
      {#if cookware.length > 0}
        <section>
          <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Cookware</div>
          <div role="list">
            {#each cookware as item, i (i)}
              <div
                role="listitem"
                class="flex justify-between gap-3 border-b border-(--background-modifier-border) py-1 last:border-0"
              >
                <span>{item.name}</span>
                {#if item.display}
                  <span class="shrink-0 font-medium tabular-nums text-(--text-muted)">{item.display}</span>
                {/if}
              </div>
            {/each}
          </div>
        </section>
      {/if}
    </div>
  {/if}

  {#if timers.length > 0}
    <section class="border-t border-(--background-modifier-border) pt-5">
      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Timers</div>
      <div class="flex flex-wrap gap-2">
        {#each timers as timer, i (i)}
          <div class="flex items-center gap-2 rounded-(--radius-m) border border-(--background-modifier-border) px-3 py-1.5">
            {#if timer.name}<span class="text-sm text-(--text-muted)">{timer.name}</span>{/if}
            <TimerComponent seconds={timer.seconds} />
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <section class="border-t border-(--background-modifier-border) pt-5">
    <div class="mb-3 text-xs font-semibold uppercase tracking-wider text-(--text-muted)">Method</div>
    {#each parsed.recipe.sections as section, s (s)}
      {#if section.name}
        <div class="mb-2 mt-4 font-semibold">{section.name}</div>
      {/if}
      <div role="list">
        {#each section.content as content, c (c)}
          {#if content.type === "step"}
            <div
              role="listitem"
              class="relative pb-5 pl-9 leading-relaxed last:pb-0 before:absolute before:left-3 before:top-7 before:bottom-0 before:w-px before:bg-(--background-modifier-border) before:content-[''] last:before:hidden"
            >
              <span
                class="absolute left-0 top-0 flex size-6 items-center justify-center rounded-full bg-(--interactive-accent) text-xs font-semibold text-(--text-on-accent)"
              >{content.value.number}</span>
              <div>
                {#each content.value.items as item, k (k)}
                  {#if item.type === "text"}
                    {item.value}
                  {:else}
                    <span class={tokenClass(item.type)}>{itemText(item)}</span>
                  {/if}
                {/each}
              </div>
            </div>
          {:else}
            <div class="py-1 italic text-(--text-muted)">{content.value}</div>
          {/if}
        {/each}
      </div>
    {/each}
  </section>
</article>
