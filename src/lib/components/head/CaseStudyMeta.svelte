<script lang="ts">
  import type { SubTypes } from '$lib/types';
  import EditableNumber from '../generic/EditableNumber.svelte';
  import EditableText from '../generic/EditableText.svelte';
  import GlobeViz from './GlobeViz.svelte';
  import GlobeVizEditor from './GlobeVizEditor.svelte';

  export let caseStudy: SubTypes.CaseStudy.PageHead;
  export let editable = false;

  const placeholders = {
    name: 'Project name',
    established: 2000,
    size: 1234,
    governance: 'Adipisicing minim eiusmod eu officia voluptate incididunt officia sit nostrud cupidatat.',
    staff: '12 workers',
    budget:
      'US$552,479 as direct costs of the protected area, plus part of the support services and enterprise development costs of the co-managing NGO',
    budgetLevel: 'Above basic, but less than optimal'
  };
</script>

<div class="casestudy-meta">
  <div class="meta-grid meta-grid-1">
    <div class="grid-cell">
      <div class="meta-title">Name</div>
      <EditableText bind:value={caseStudy.name} placeholder={placeholders.name} {editable} />
    </div>

    <div class="grid-cell side-by-side-1">
      <div class="meta-title">Established in</div>
      <EditableNumber bind:value={caseStudy.established} {editable} placeholder={placeholders.established} />
    </div>

    <div class="grid-cell side-by-side-2">
      <div class="meta-title">Size</div>
      <EditableNumber bind:value={caseStudy.size} {editable} placeholder={placeholders.size} unitSuffix="km²" />
    </div>

    <div class="globe-cell">
      {#if editable}
        <GlobeVizEditor bind:lat={caseStudy.lat} bind:long={caseStudy.long} />
      {:else}
        <GlobeViz lat={caseStudy.lat} long={caseStudy.long} />
      {/if}
    </div>
  </div>

  <div class="meta-grid meta-grid-2">
    <div class="grid-cell">
      <div class="meta-title">Governance</div>
      <EditableText bind:value={caseStudy.governance} placeholder={placeholders.governance} {editable} />
    </div>

    <div class="grid-cell">
      <div class="meta-title">Staff</div>
      <EditableText bind:value={caseStudy.staff} placeholder={placeholders.staff} {editable} />
    </div>

    <div class="grid-cell">
      <div class="meta-title">Budget</div>
      <EditableText bind:value={caseStudy.budget} placeholder={placeholders.budget} {editable} />
    </div>

    <div class="grid-cell">
      <div class="meta-title">Budget level</div>
      <EditableText bind:value={caseStudy.budgetLevel} placeholder={placeholders.budgetLevel} {editable} />
    </div>
  </div>
</div>

<style lang="stylus">

  .meta-grid {
    display: grid;
    grid-template-rows: auto auto;
    grid-auto-flow: row;
    column-gap: 1.5rem;
    color: white;

    &.meta-grid-1 {
      grid-template-columns: 30% 15% 22.5% 30%;
      min-height: 110px;
      margin-bottom: 45px;
    }

    &.meta-grid-2 {
      grid-template-columns: 22.5% 22.5% 22.5% 22.5%;
    }
  }

  .meta-grid :global(.editable-content) {
    background: transparent;
    border: 0;
    padding: 0;
    height: fit-content;
  }

  .meta-grid-1 :global(.editable-content) {
    typography: p-large-responsive;
  }

  .meta-grid-2 :global(.editable-content) {
    typography: p-responsive;
  }

  .meta-title {
    typography: h5-graphic;
    color: #F9F9F9;
    color: $colors.neutral-bg;
    margin: 0;
  }

  .globe-cell {
    position: relative;
    > :global(*) {
      position: absolute;
      transform: translateY(-55%);
    }
  }


  +breakpoint(page, medium) {
    .meta-grid {
      &.meta-grid-1 {
        grid-template-columns: 22.5% 15% 22.5% 30%;
        min-height: 110px;
      }
    }
  }


  +breakpoint(page, small) {

    .grid-cell {
      margin-bottom: 2rem;
    }

    .side-by-side-1 {
      display: inline-block;
      margin-right: 75px;
    }

    .side-by-side-2 {
      display: inline-block;
    }

    .meta-grid {
      display: block;
      color: white;

      &.meta-grid-1 {
        min-height: 110px;
        margin-bottom: 0px;
      }

      &.meta-grid-2 {
        margin-bottom: 0px;
      }
    }

    .globe-cell {
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translate(-50%, -100px);
    > :global(.globe) {
        position: absolute;
        left: 50%;
        transform: translate(-50%);
      }
    }

  }

</style>
