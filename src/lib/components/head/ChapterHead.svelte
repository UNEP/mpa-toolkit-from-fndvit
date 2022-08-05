<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import KeyTakeaways from "$lib/components/cms/KeyTakeaways.svelte";
  import EditableText from "../generic/EditableText.svelte";
  import LifeCycle from "../LifeCycle.svelte";
  import Authors from "./Authors.svelte";

  export let chapter: SubTypes.Chapter.PageHead;
  export let tags: SubTypes.PageTag[];
  export let editable = false;
  export let readTime: number = undefined;

  if (!chapter) {
    chapter = {
      authors: [],
      keyTakeaways: [],
      summary: ''
    };
  }

  $: hasKeyTakeaways = chapter.keyTakeaways?.length > 0;

</script>

<div class="chapter-head" class:meta-editable={editable} class:has-keytakeaways={hasKeyTakeaways}>

  <div class="byline">

    <Authors bind:authors={chapter.authors} {editable} />

    {#if readTime !== undefined}
      <div class="readtime">{readTime} min read</div>
    {/if}

  </div>

  <div class="summary">
    <EditableText bind:value={chapter.summary} {editable} placeholder='Summary text...' />
  </div>

  {#if hasKeyTakeaways}
    <div class="keytakeaways-container">
      <KeyTakeaways bind:keyTakeaways={chapter.keyTakeaways} {editable}/>
    </div>
  {/if}

  {#if !editable}
    <div class="lifecycle-container">
      <LifeCycle {tags}/>
    </div>
  {/if}

</div>

<style lang="stylus">

  .chapter-head:not(.has-keytakeaways) {
    grid-config(page, chapter-no-keytakeaways);
  }

  .chapter-head.has-keytakeaways {
    grid-config(page, chapter);
  }

  .chapter-head {
    --ui-color-placeholder: #ffffff55;

    padding: 2rem 0 0;
    background: $colors.primary-blue;
    color: $colors.neutral-bg;

    +breakpoint(page, medium) {
      &:before {
        content: '';
        grid-column: 1 / -1;
        grid-row: -2 / -1;
        background: linear-gradient(180deg, transparent $lifecycle-y-overlap, white $lifecycle-y-overlap);

      }
    }
  }

  .byline {
    grid-area: byline;
    typography: ui;
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    column-gap: 10px;
  }

  .summary {
    typography: p-large-responsive;
    grid-area: summary;
    max-width: 800px;
    margin-bottom: 40px;
  }
  .keytakeaways-container {
    grid-area: keytakeaways;
    margin: 0 0 2rem -30px;

    +breakpoint(page, medium) {
      margin-left: 0;
    }
  }

  .lifecycle-container {
    grid-area: lifecycle;
    position: relative;
    > :global(.lifecycle) {
      position: absolute;
      z-index: lifecycle;
      margin-right: -30px;
      margin-left: 20px;
      max-width: 300px;
      box-sizing: border-box;

      +breakpoint(page, medium) {
        position: static;
        margin: 0;
        max-width: none;
      }
    }

  }

</style>