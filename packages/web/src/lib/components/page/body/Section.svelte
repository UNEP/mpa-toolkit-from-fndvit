<script lang="ts">
  import type { Section } from '@mpa/db';
  import ExpandButton from './ExpandButton.svelte';
  export let section: Section;

  let expanded = false;

  const index = section.blocks.findIndex((_, i) => i > 2 && section.blocks[i - 1].type !== 'heading');
  const hideFrom = index !== -1 ? index + 1 : null;
</script>

<section
  class="content-section"
  id={section.id}
  class:collapsed={hideFrom != null && !expanded}
  data-hidefrom={hideFrom}
>
  <slot />
  {#if hideFrom != null}
    <ExpandButton content={section.topic} {expanded} on:click={() => (expanded = !expanded)} />
  {/if}
</section>

<style lang="stylus">

  for i in 1..10
    .collapsed[data-hidefrom=\"{i}\"] > :global(:nth-child(n+{i}):not(.expand-button))
      display: none;

</style>
