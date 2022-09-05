<script lang="ts">
  import type { DiagramBlock } from '@mpa/db';
  import Diagram from './Diagram.svelte';

  export let block: DiagramBlock;
</script>

<Diagram diagram={block.attrs} />
