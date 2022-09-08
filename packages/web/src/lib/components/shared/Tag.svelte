<script lang="ts">
  import type { Tag } from '@mpa/db';
  import { slugify } from '@mpa/utils';
  import { page } from '$app/stores';

  type TagStyles = 'PRIMARY' | 'SECONDARY';

  export let tag: Tag;
  export let style: TagStyles;
  export let cms = false;

  $: tagName = cms ? 'button' : 'a';
  $: highlightTagIds = $page.data.highlightTagIds as number[];
  $: tagHighlights = ($page.data.tagHighlights || {}) as { [id: string]: string };
  $: secondary = style === 'SECONDARY';
</script>

<svelte:element
  this={tagName}
  href={cms ? undefined : `/tag/${slugify(tag.value)}`}
  class="tag {secondary ? 'secondary' : ''} "
  tabindex="0"
  on:mouseenter
  on:mouseleave
  on:click
>
  <span>
    {#if highlightTagIds && highlightTagIds.includes(tag.id)}
      <b>{tag.value}</b>
    {:else if tagHighlights[tag.id]}
      {@html tagHighlights[tag.id]}
    {:else}
      {tag.value}
    {/if}
  </span>
  {#if cms && style === 'PRIMARY'}
    <span class="material-icons">close</span>
  {/if}
</svelte:element>

<style lang="stylus">
  .tag {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    padding: 2px 12px 4px;
    border-radius: 18px;
    border: none;
    overflow: hidden;
    margin: 0;
    color: black;
    position: relative;
    white-space: nowrap;
    height: fit-content;
    width: fit-content;
    background: $colors.highlight-1;
    &.secondary {
      background: alpha($colors.highlight-1, 0.4);
    }

    :global(.collection-card) &,
    :global(.content-carousel-card) & {
      background: $colors.tag-bg-cards;
      &.secondary {
        background: alpha($colors.tag-bg-cards, 0.4);
      }
    }

    span:first-child {
      typography: ui-small;
      position: relative;
    }

    .material-icons {
      font-size: 14px;
      vertical-align: middle;
    }
  }
  .tag:hover {
    text-decoration: none;
    filter: brightness(105%);
  }
</style>
