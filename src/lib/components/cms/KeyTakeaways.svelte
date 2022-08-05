<script lang="ts">
  import Cards from "$lib/components/Cards/Cards.svelte";
  import IconButton from "$lib/components/generic/IconButton.svelte";

  export let keyTakeaways: string[] = [];
  export let editable = false;

  let cards = keyTakeaways.map(text => ({
    heading: 'Key takeaways',
    body: text,
  }));

  $: keyTakeaways = cards.map(c => c.body);

  const onClickAdd = () => {
    cards.push({ heading: 'Key takeaways', body: ''});
    cards = cards;
  };

</script>

{#if keyTakeaways.length}
  <div class="key-takeaways">
    <Cards bind:cards {editable} canToggleHeading={false} fixedTitle="Key takeaways" />
  </div>
{:else if editable}
  <div class="add-key-takeaways">
    <IconButton icon="add" on:click={onClickAdd} text="Add Key takeaways" />
  </div>
{/if}

<style lang="stylus">
  .key-takeaways {
    --ec-hover-bg: #ffffff44;
    :global(.button) {
      margin: auto;
    }
  }
  .add-key-takeaways {
    margin-bottom: -10px;
    --ib-color: #ffffffee;
    --ib-hover-border: 1px solid transparent;
    --ib-hover-bg: #00000011;
  }

</style>