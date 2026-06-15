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
            <li>
                <button
                    type="button"
                    class="cook-list-item"
                    onclick={() => remove(ingredient)}
                >
                    {ingredient.quantity}
                    {ingredient.units}
                    {ingredient.name}
                </button>
            </li>
        {/each}
    </ul>
</div>

<style>
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
