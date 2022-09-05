<script lang="ts">
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import type { DiagramBlock } from '@mpa/db';
  import Diagram from '$lib/components/page/body/Diagram.svelte';

  export let attrs: DiagramBlock['attrs'];
  export let controls: SvelteNodeViewControls;
  export let rootDOM: (node: HTMLElement) => void;
</script>

<div use:rootDOM contenteditable="false" class="diagram-view">
  <Diagram bind:diagram={attrs} editable {controls} />
</div>

<style lang="stylus">

  :global(.svelte-node-view--cards.ProseMirror-selectednode .diagram-view) {
    filter: brightness(98%);
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.20);
    outline: 1px solid #33333333;
  }

  .diagram-view {
    width: fit-content;
  }

</style>
