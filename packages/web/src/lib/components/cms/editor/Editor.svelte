<script lang="ts">
  import type { ContentDocument } from '@mpa/db';
  import { EditorState } from 'prosemirror-state';
  import { svelteNodeViewPlugin } from 'prosemirror-svelte-nodeview';
  import type { EditorView } from 'prosemirror-view';
  import { onMount, setContext } from 'svelte';
  import EditorMenu from './toolbar/EditorMenu.svelte';
  import { DiagramView, CardsView, ImageView, HeadingView } from './nodeview';
  import ProsemirrorEditor from './ProsemirrorEditor.svelte';
  import { schema } from '$lib/editor/schema';
  import { plugins } from '$lib/editor/plugins';

  let focusEditor: () => void;
  let view: EditorView;

  export let content: ContentDocument = null;

  let editorState = EditorState.create({
    schema,
    doc: content ? schema.nodeFromJSON(content) : undefined,
    plugins: [
      ...plugins(schema),
      svelteNodeViewPlugin({
        nodes: {
          cards: CardsView,
          image: ImageView,
          heading: HeadingView,
          diagram: DiagramView
        }
      })
    ]
  });

  $: content = editorState.doc.toJSON() as ContentDocument;

  $: setContext('editorView', view);

  onMount(() => focusEditor());
</script>

{#if view}
  <EditorMenu {editorState}>
    <slot name="menu-extra" slot="extra-controls" />
  </EditorMenu>
{/if}
<div class="editor-content">
  <div class="prosemirror-container">
    <ProsemirrorEditor bind:editorState bind:view bind:focus={focusEditor} />
  </div>
</div>

<style lang="stylus">
  .editor-content {
    display: grid;
    grid-template-columns: 70% auto;
    column-gap: 1rem;
  }
  .prosemirror-container {
    width: 40rem;
    margin: 0 auto;
    text-align: left;
    font-family: var(--font-sans-serif);
    --heading-color: #000;
    :global(h1), :global(h2) {
      font-weight: 300;
    }
    :global(h1) {
      font-size: 3rem;
    }
    :global(h2) {
      font-size: 2rem;
    }
    :global(p) {
      font-weight: 400;
      font-size: 1.125rem;
    }
    :global(cards) {
      display: flex;
      flex-direction: column;
      row-gap: 0.1rem;
    }
    :global(cards:not(.selected) card:not(:first-child)) {
      display: none;
    }
    :global(card) {
      display: block;
      background: $colors.primary-blue;
      color: white;
      padding: 0 2rem;
      padding-bottom: 1rem;
      font-size: 1rem;
      border-radius: 20px 20px 0px 0px;
      :global(h3), :global(p) {
        color: white;
      }
      :global(h3) {
        margin-bottom: 1rem;
      }
      :global(p) {
        font-size: 1rem;
      }
    }
  }

</style>
