<script lang="ts">
  import type { SubTypes, Tag } from "$lib/types";
  import CollectionCards from "$lib/components/CollectionCards.svelte";
  import { groupBy } from "$lib/helpers/utils";
  import Filters from "$lib/components/Filters.svelte";

  export let allTags: Tag[] = null;
  export let pages: SubTypes.Page.CmsList[];

  let activeTags: SubTypes.Tag[] = [];
  let pageSearch: string;

  $: searchRegex = new RegExp(pageSearch, 'i');

  $: filteredPages = pages
    .filter(p => searchRegex.test(p.title))
    .filter(p => activeTags.every(tag => p.tags.find(pageTag => pageTag.tag.id === tag.id)));

  $: grouped = groupBy(filteredPages, p => p.draft ? 'draft' : 'live');

</script>

<div class="container">
  <div class="title">

    <a href="/cms">
      <span class="material-icons">navigate_before</span>
    </a>
    <h2>Pages</h2>

    <div class="grid-links">
      <a href="/cms/pages/create/chapter">
        <div class="cms-links">
          <span class="material-icons icon-links">auto_stories</span>
          <p>CHAPTER</p>
        </div></a>

      <a href="/cms/pages/create/case-study">
        <div class="cms-links">
          <span class="material-icons icon-links">location_on</span>
          <p>CASE STUDY</p>
        </div></a>
    </div>
  </div>

  <div class="filters">
    <Filters tags={allTags} bind:activeTags bind:pageSearch/>
  </div>

  <div class="pages">
    <h4>Draft</h4>
    {#if grouped.draft}
      <CollectionCards pages={grouped.draft} cms />
    {:else}
      No draft pages
    {/if}
  </div>
  <div class="pages">
    <h4>Live</h4>
    {#if grouped.live}
      <CollectionCards pages={grouped.live} cms />
      {:else}
        No live pages
    {/if}
  </div>
</div>

<style lang="stylus">

  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    margin: 0px auto;
    typography: ui;

    h2 {
      typography: h2-responsive;
    }

    h4 {
      typography: h4-light;
    }
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;
    margin-bottom: 20px;
    --ib-hover-border: 1px solid #ddd;

    .grid-links {

      display: grid;
      grid-template-columns: auto auto auto;
      grid-gap: 24px;
      text-align: center;
      position: absolute;
      right: 20px;
      margin-top: 80px;

      p {
        margin: 0;
        typography: h4-light;
        color: black;
      }

      a {
        text-decoration: none;
      }
    }

    .material-icons {
      color: black;
      font-size: 32px;
    }

    .cms-links {
      background: white;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      width: 185px;
      height: 140px;

      &:hover{
        background: $colors.neutral-light;
      }

      .icon-links {
        padding: 20px 0 10px;
        font-size: 68px;
      }
    }
  }
</style>