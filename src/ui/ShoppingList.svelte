<script lang="ts">
    import store from "../store";

    let {
        shoppingList: { items, remove },
    } = store;
</script>

<div>
    <h2>Shopping List</h2>
    <ul>
        {#each $items as ingredient}
            <li on:click={() => remove(ingredient)}>
                {ingredient.quantity}
                {ingredient.units}
                {ingredient.name}
            </li>
        {/each}
    </ul>
</div>
