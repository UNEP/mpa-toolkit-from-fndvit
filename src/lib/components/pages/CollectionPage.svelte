<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import CollectionCards from '$lib/components/CollectionCards.svelte';
  import CollectionPageHeader from '../CollectionPageHeader.svelte';

  export let pages: SubTypes.Page.CollectionCard[];
  export let title: string;
  export let bio: string;
  export let search: string = null;

</script>

<div class="collection-page">
  <CollectionPageHeader {title} {search} {bio}/>
  <div class="content">
    {#if pages.length === 0}
      {#if search}
        <h2>No results found</h2>
      {:else}
        <h2>No pages</h2>
      {/if}
    {:else}
      <CollectionCards {pages} />
    {/if}
  </div>
</div>

<style lang="stylus">

  .collection-page {
    --page-padding: 90px;
    --page-max-content-width: 1450px;
  }
  .content {
    background: #ffffff;
    padding: 30px var(--page-padding);
    max-width: var(--page-max-content-width);
    margin: auto;
    h2 {
      typography: h3-light-responsive;
    }
  }
  @media (max-width: 1024px) {
    .collection-page {
      --page-padding: 40px;
    }
  }
  @media (max-width: 768px) {
    .collection-page {
      --page-padding: 20px;
    }
  }
</style>
