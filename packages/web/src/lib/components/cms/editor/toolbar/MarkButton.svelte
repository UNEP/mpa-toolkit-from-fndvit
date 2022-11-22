<script lang="ts">
  import { toggleMark } from 'prosemirror-commands';
  import type { MarkType } from 'prosemirror-model';
  import type { EditorState } from 'prosemirror-state';
  import type { EditorView } from 'prosemirror-view';
  import { getContext } from 'svelte';
  import { IconButton } from '$lib/components/generic';

  export let editorState: EditorState;
  export let markType: MarkType;
  export let icon: string = null;
  export let text: string = null;
  export let attrs: Record<string, unknown> = null;

  $: toggle = toggleMark(markType, attrs ? { ...attrs } : null);

  const view = getContext('editorView') as EditorView;

  function onClick() {
    toggle(editorState, view.dispatch);
  }

  function markActive(state: EditorState, type: MarkType) {
    let { from, to, empty } = state.selection;
    if (empty) return !!type.isInSet(state.storedMarks || state.selection.$from.marks());
    else return state.doc.rangeHasMark(from, to, type);
  }

  $: active = markActive(editorState, markType);
</script>

<IconButton on:click={onClick} {icon} {text} {active} />
