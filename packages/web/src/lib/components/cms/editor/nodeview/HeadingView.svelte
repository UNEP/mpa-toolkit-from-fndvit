<script lang="ts">
  import type { HeadingBlock } from '@mpa/db';
  import { IconButton } from '$lib/components/generic';
  import { clickOutside } from '$lib/helpers/utils';
  import ExpandButtonEditor from '$lib/components/page/body/ExpandButtonEditor.svelte';

  export var attrs: HeadingBlock['attrs'];
  export var contentDOM: (node: HTMLElement) => void;

  $: if (attrs.level < 1 || attrs.level > 6) throw new Error('Section level must be between 1 and 6');

  $: tag = `h${attrs.level}`;

  let expanded = false;

  $: sectionHeading = attrs.level === 1;
  $: sectionTextIsEmpty = attrs.showmore.length === 0;
  $: needsShowMoreText = sectionTextIsEmpty && sectionHeading;
  $: buttonTooltip = sectionTextIsEmpty && !expanded && 'Click to fill the expand button text for this section';
</script>

<div class="hv" class:section-heading={sectionHeading} class:needs-showmore-text={needsShowMoreText}>
  <svelte:element this={tag}>
    <div class="hv-controls" class:expanded contenteditable="false" use:clickOutside={() => (expanded = false)}>
      <IconButton icon="settings" on:click={() => (expanded = !expanded)} title={buttonTooltip} />
      <div>
        <ExpandButtonEditor bind:content={attrs.showmore} on:complete={() => (expanded = false)} />
      </div>
    </div>
    <div use:contentDOM />
  </svelte:element>
</div>

<style lang="stylus">
  .hv {
    position: relative;
  }

  .hv-controls {
    position: absolute;
    margin-top: 0.15em;
    left: -40px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    --ib-icon-size: 1.5rem;
    --ib-icon-bg: transparent;
    --ib-color: #aaa;
    --ib-hover-filter: brightness(90%);

    .hv:not(.section-heading) & {
      display: none;
    }

    .hv.needs-showmore-text & {
      --ib-color: #ffb76d;

    }

    &:not(.expanded) :global(.expand-button) {
      display: none;
    }

    :global(.mini-editor *) {
      font-size: 12px !important;
      margin: 0;
    }
    :global(.mini-editor) {
      min-width: 200px;
      outline: none;
      height: 40px;
      display: flex;
      align-items: center;
    }

    :global(.expand-button > button) {
      margin-bottom: 0;
    }
  }

</style>
