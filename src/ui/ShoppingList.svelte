<script lang="ts">
    import store from "../store";

    const {
        shoppingList: { items, remove },
    } = store;
</script>

<div>
    <h2>Shopping List</h2>
    <ul>
        {#each $items as ingredient, i (i)}
            <li onclick={() => remove(ingredient)}>
                {ingredient.quantity}
                {ingredient.units}
                {ingredient.name}
            </li>
        {/each}
    </ul>
</div>
