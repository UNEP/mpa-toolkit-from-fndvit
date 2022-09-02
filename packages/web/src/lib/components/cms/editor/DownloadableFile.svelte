<script lang="ts">
  import type { DiagramResource } from '@mpa/db';
  import { createEventDispatcher } from 'svelte';
  import { InlineSvg, IconButton } from '$lib/components/generic';
  import { staticUrl } from '$lib/helpers/content';
  import EditableText from '$lib/components/generic/EditableText.svelte';

  export let resource: DiagramResource;
  export let filename: string;
  export let editable = false;

  const dispatch = createEventDispatcher<{ delete: null }>();

  function onClickDelete(e: Event) {
    e.preventDefault();
    dispatch('delete');
  }

  function onClickLabel(e: Event) {
    if (editable) e.preventDefault();
  }
</script>

<a class="downloadable-file" href={staticUrl(resource.url)} download={filename} target="_blank">
  <InlineSvg svg="file" />
  <strong on:click={onClickLabel}><EditableText bind:value={resource.label} {editable} /></strong>
  {#if editable}
    <IconButton icon="delete" on:click={onClickDelete} />
  {/if}
</a>

<style lang="stylus">

  .downloadable-file {
    display: block;
    position: relative;
    typography: ui-small;
    color: black;
    &:hover {
      filter: drop-shadow(0 0 3px #b1b1b1);
      z-index: 1;
      :global(.page-editor) & strong {
        outline: 1px solid black;
        border-radius: 4px;
        cursor: text
      }
    }

    strong {
      position: absolute;
      text-align: right;
      right: 1.15rem;
      top: 0.75rem;
      --caret-color: black;
      --outline-color: #2a2a2a;
      --outline-width: 1px;
      :global(.editable-text) {
        min-width: 20px;
      }
    }

    &:not(:hover) :global(.icon-button-container) {
      display: none;
    }

    :global(.icon-button-container) {
      position: absolute;
      top: 0.7rem;
      right: 0;
      transform: translateX(10px);
      display: flex;
      justify-content: center;
      --ib-size: 1.25rem;
      --ib-bg: white;
      --ib-hover-bg: $colors.secondary-bg;
      filter: drop-shadow(0 0 2px #b1b1b1) ;
    }

  }
</style>
