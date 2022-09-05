<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import BlockButton from './BlockButton.svelte';
  import { schema } from '$lib/editor/schema';
  import { hoverTimer } from '$lib/helpers/utils';

  export let editorState: EditorState;

  const { state: showPopup, enter, leave } = hoverTimer(350);
</script>

<div
  class="heading-block-button"
  class:heading-block-button--active={$showPopup}
  on:mouseenter={enter}
  on:mouseleave={leave}
>
  <BlockButton {editorState} nodeType={schema.nodes.heading} text="H" />
  <div class="heading-block-button-popup">
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{ level: 1 }} text="H1" />
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{ level: 2 }} text="H2" />
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{ level: 3 }} text="H3" />
  </div>
</div>

<style lang="stylus">
  .heading-block-button {
    position: relative;
    font-weight: 500;
  }
  .heading-block-button-popup {
    position: absolute;
    top: 100%;
    margin-top: 5px;
    filter: drop-shadow(0 0 4px #2a2a2a11);
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    display: flex;
    column-gap: 5px;
    background: $colors.neutral-bg;
    border: 1px solid $colors.secondary-bg;


    .heading-block-button:not(.heading-block-button--active) & {
      display: none;
    }
  }
</style>
