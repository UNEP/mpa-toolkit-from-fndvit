<script lang="ts">
  import type { HeadingBlock } from '@mpa/db';
  import Inline from './Inline.svelte';
  export let block: HeadingBlock;
  const level = block.attrs.level;

  const cls = `block-h${level}`;
</script>

<svelte:element this={`h${level}`} class={cls}>
  {#each block.content as child}<Inline block={child} />{/each}
</svelte:element>

<style lang="stylus">
  .block-h1 {
    typography: h2-responsive;
    margin: 2rem 0;
  }
  .block-h2 {
    typography: h3-responsive;
    margin: 2rem 0;
  }
  .block-h3 {
    typography: h4-graphic-responsive;
    margin: 2rem 0;
  }
</style>
