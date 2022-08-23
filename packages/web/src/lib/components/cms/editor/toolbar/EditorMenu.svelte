<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import MarkButton from './MarkButton.svelte';
  import MenuSeperator from './MenuSeperator.svelte';
  import BlockButton from './BlockButton.svelte';
  import ListControls from './ListControls.svelte';
  import ImageButton from './ImageButton.svelte';
  import Formatting from './Formatting.svelte';
  import { IconButton } from '$lib/components/generic';
  import { schema } from '$lib/editor/schema';

  export let editorState: EditorState;

  const view = getContext('editorView') as EditorView;

  const insertCards = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.cards.createAndFill());
    view.dispatch(tr);
  };
</script>

<div class="menu-bar">
  <div class="left-section">
    <MarkButton {editorState} markType={schema.marks.strong} icon="format_bold" />
    <MarkButton {editorState} markType={schema.marks.em} icon="format_italic" />
    <MenuSeperator />
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{ level: 1 }} text="H1" />
    <BlockButton {editorState} nodeType={schema.nodes.heading} attrs={{ level: 2 }} text="H2" />
    <BlockButton {editorState} nodeType={schema.nodes.paragraph} text="¶" />
    <MenuSeperator />
    <ListControls {editorState} />
    <MenuSeperator />
    <IconButton on:click={insertCards} icon="library_books" title="Add cards" />
    <MenuSeperator />
    <ImageButton title="Add image" />
    <MenuSeperator />
  </div>

  <div class="right-section">
    <Formatting {editorState} />
    <slot name="extra-controls" />
  </div>
</div>

<style lang="stylus">

  .menu-bar {
    --ib-icon-bg: transparent;
    --ib-hover-border: 1px solid #ddd;
    --ib-hover-bg: transparent;
    --ib-active-bg: white;
    --ib-active-border: 1px solid #ccc;

    position: sticky;
    display: flex;
    top: 0;
    z-index: editor-menubar;
    width: 100%;
    padding: 0.5rem;
    border-bottom: 1px solid #ccc;
    background: $colors.neutral-bg;
    box-sizing: border-box;
  }

  .left-section {
    --ib-font-size: 0.8rem;
  }

  .left-section,
  .right-section {
    display: flex;
    column-gap: 0.4rem;
  }

  .right-section {
    flex: 1;
    justify-content: end;
  }
</style>
