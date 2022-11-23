<script lang="ts">
  import { toggleMark } from 'prosemirror-commands';
  import type { MarkType } from 'prosemirror-model';
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import { IconButton } from '$lib/components/generic';
  import { tick } from 'svelte';
  import { slide } from 'svelte/transition';

  export let editorState: EditorState;
  export let markType: MarkType;
  export let icon: string = null;
  export let text: string = null;

  const view = getContext('editorView') as EditorView;

  let url: string;
  let urlEditor: HTMLInputElement;
  let urlEditorVisible = false;

  async function onClick() {
    let { from, to, empty } = editorState.selection;
    if (editorState.doc.rangeHasMark(from, to, markType)){
      toggle(editorState, view.dispatch);
    }
    else if (!empty) {
      urlEditorVisible = true;
      await tick();
      urlEditor.focus();
    }
  }

  function markActive(state: EditorState, type: MarkType) {
    let { from, to, empty } = state.selection;
    if (empty) return !!type.isInSet(state.storedMarks || state.selection.$from.marks());
    else return state.doc.rangeHasMark(from, to, type);
  }

  const onSubmit = () => { toggle(editorState, view.dispatch) };
  const onBlur = () => { urlEditorVisible = false };

  $: editorState.selection ? urlEditorVisible = false : {};
  $: active = markActive(editorState, markType);
  $: attrs = { href: url };
  $: toggle = toggleMark(markType, attrs ? { ...attrs } : null);

</script>

<IconButton on:click={onClick} {icon} {text} {active} />

{#if urlEditorVisible}
  <form on:submit|preventDefault={onSubmit}>
    <input
      bind:this={urlEditor}
      type="url"
      placeholder="https://example.com"
      bind:value={url}
      on:blur={onBlur}
      transition:slide
    />
  </form>
{/if}

<style lang="stylus">

  input {
    padding: 5px;
    filter: drop-shadow(0 0 4px #2a2a2a11);
    background: $colors.neutral-bg;
    border: 1px solid $colors.secondary-bg;
    outline: 1px solid black;
  }

</style>

