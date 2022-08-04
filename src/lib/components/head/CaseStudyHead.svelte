<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import Milestones from './Milestones.svelte';
  import KeyLearnings from '../Cards/KeyLearnings.svelte';
  import LifeCycle from '../LifeCycle.svelte';
  import CaseStudyMeta from './CaseStudyMeta.svelte';

  export let caseStudy: SubTypes.CaseStudy.PageHead;
  export let tags: SubTypes.PageTag[];
  export let editable = false;

  $: hasMilestones = !!Object.keys(caseStudy.milestones).length;
</script>

<div class="casestudy-head">
  <div class="meta-container">
    <CaseStudyMeta bind:caseStudy {editable} />

    {#if editable && !hasMilestones}
      <div class="add-milestones-button">
        <IconButton icon="add" on:click={() => (caseStudy.milestones = { '': [''] })} text="Add milestones" />
      </div>
    {/if}
  </div>
  {#if hasMilestones}
    <div class="milestones-container">
      <Milestones bind:milestones={caseStudy.milestones} {editable} />
    </div>
  {/if}

  <div class="keylearnings-lifecycle">
    <div class="keylearnings-container">
      <div class="keylearnings-card">
        <KeyLearnings bind:keyLearnings={caseStudy.keyLearnings} {editable} />
      </div>
    </div>

    {#if !editable}
      <div class="lifecycle-container">
        <div class="lifecycle">
          <LifeCycle {tags} />
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="stylus">

  .casestudy-head {
    background: $colors.secondary-bg;
  }

  .meta-container,
  .milestones-container,
  .keylearnings-lifecycle {
    grid-config(page, case-study);
  }

  .meta-container {
    background-color: $colors.deep-blue;
    padding: 35px 0px;
    --ui-color-placeholder: #ffffff55;
    position: relative;
    background-color: $colors.deep-blue;
    box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.2);

    > :global(.casestudy-meta) {
      grid-area: meta;
    }

  }

  .lifecycle-container {
    grid-area: lifecycle;
  }

  .lifecycle {
    grid-area: lifecycle;
    position: relative;

    > :global(.lifecycle) {
      position: absolute;
      z-index: lifecycle;
      margin-right: -30px;
      margin-left: 20px;
      margin-top: 40px;
      max-width: 300px;
      box-sizing: border-box;

      +breakpoint(page, medium) {
        position: static;
        margin: 0;
        max-width: none;
      }
    }
  }

  :global(.page-editor) .keylearnings-lifecycle {
    margin-top: 20px;
  }

  .keylearnings-container {
    grid-area: keylearnings;
    position: relative;
    padding-top: 40px;
    padding-bottom: 40px;
  }

  .keylearnings-card {
    grid-area: keylearnings;
    margin-left: -30px;
  }

  .milestones-container {
    grid-column: 1 / -1;
    > :global(.milestones) {
      grid-area: meta;
    }
    background: $colors.dark-blue;
    box-shadow: inset 0px 0px 16px rgba(0, 0, 0, 0.15);

    +breakpoint(page, medium) {
        margin-bottom: $lifecycle-y-overlap * -1;
        padding-bottom: $lifecycle-y-overlap;
    }
  }

  .add-milestones-button {
    grid-area: meta;
    grid-row: 2;
    margin-bottom: -20px;
    margin-top: 10px;
    --ib-color: #ffffffee;
    --ib-hover-border: 1px solid transparent;
    --ib-hover-bg: #00000011;
  }

  +breakpoint(page, medium) {

    .keylearnings-card {
      margin-left: 0px;
    }

    .lifecycle-container {
      padding-bottom: 40px;
    }

    .keylearnings-container {
      padding-top: 0px;
    }
  }

  +breakpoint(page, small) {
    .meta-container {
      margin-left:0px;
      padding-top: 150px;
      width: fit-content;
    }
  }
</style>
