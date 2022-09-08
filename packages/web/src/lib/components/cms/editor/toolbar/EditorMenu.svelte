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
  import HeadingBlockButton from './HeadingBlockButton.svelte';
  import { IconButton } from '$lib/components/generic';
  import { schema } from '$lib/editor/schema';
  import { createEmptyCard, createEmptyDiagram } from '$lib/helpers/content';

  export let editorState: EditorState;

  const view = getContext('editorView') as EditorView;

  const insertCards = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.cards.createAndFill(createEmptyCard()));
    view.dispatch(tr);
  };

  const insertDiagram = () => {
    const tr = editorState.tr.replaceSelectionWith(schema.nodes.diagram.createAndFill(createEmptyDiagram()));
    view.dispatch(tr);
  };

  const insertReminder = () => {
    const tr = editorState.tr.insertText('*TODO: *');
    view.dispatch(tr);
  };
</script>

<div class="menu-bar">
  <div class="left-section">
    <MarkButton {editorState} markType={schema.marks.strong} icon="format_bold" />
    <MarkButton {editorState} markType={schema.marks.em} icon="format_italic" />
    <MenuSeperator />
    <HeadingBlockButton {editorState} />
    <BlockButton {editorState} nodeType={schema.nodes.paragraph} text="¶" />
    <MenuSeperator />
    <ListControls {editorState} />
    <MenuSeperator />
    <IconButton on:click={insertCards} icon="library_books" title="Add cards" />
    <IconButton on:click={insertDiagram} icon="donut_small" title="Add diagram" />
    <MenuSeperator />
    <ImageButton title="Add image" />
    <MenuSeperator />
    <IconButton on:click={insertReminder} icon="notifications" title="Add reminder" />
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
