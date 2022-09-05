<script lang="ts">
  import type { Page } from '@mpa/db';
  import ContentMadLib from '../shared/ContentMadLib.svelte';
  import StickyMenu from './StickyMenu.svelte';
  import Section from './Section.svelte';
  import Block from './Block.svelte';
  import ContentCarousel from './ContentCarousel.svelte';
  import { createSections, getSectionSize } from '$lib/helpers/content';

  export let page: Page;
  export let recommendedPages: Page.ContentCard[] = null;

  const sections = createSections(page.content);

  const headings = sections.filter(s => s.id);

  const MIN_SIZE_FOR_MADLIB = 475;

  let cumulativeBlockLength = 0;

  const madlibIndex = sections.findIndex(section => {
    cumulativeBlockLength += getSectionSize(section);
    return cumulativeBlockLength >= MIN_SIZE_FOR_MADLIB;
  });
</script>

<div class="page-content">
  <div class="menu-container">
    <div class="menu">
      <StickyMenu menuOptions={headings} />
      <div class="sliding-arrow">
        <svg viewBox="0 0 12 20">
          <path d="M1.1814 19L9.81849 10L1.1814 1" />
        </svg>
      </div>
    </div>
  </div>
  <div class="body-column">
    {#each sections as section, i}
      <Section {section}>
        {#each section.blocks as block}
          <Block {block} />
        {/each}
      </Section>

      {#if sections.length > 1}
        {#if i === madlibIndex}
          <div class="madlib-container">
            <ContentMadLib />
          </div>
        {:else if i === 2 && recommendedPages?.length > 0}
          <div class="content-carousel-container">
            <ContentCarousel slides={recommendedPages} title={'You may also like'} />
          </div>
        {/if}
      {/if}
    {/each}
  </div>
</div>

<style lang="stylus">

  .page-content {
    grid-config(page, content);

    position: relative;
    min-height: 800px // so empty pages don't collapse
    grid-auto-rows: min-content;
    padding-bottom: 2rem;
  }

  .body-column {
    display: contents;
    > :global(*) {
      grid-column: body;
    }
  }

  .menu-container {
    grid-column: menu;
    grid-row: menu / span 100; // can't span -1 through dynamic rows
    margin: 0 1rem 0 -30px;
    z-index: sticky-menu;

    +breakpoint(page, medium) {
      margin: 0 1rem 0 0;
    }
  }

  .menu {
    position: sticky;
    top: 0;
    flex: 0

    +breakpoint(page, medium) {
      margin-top: 5px;
      width: fit-content;
      transform: translateX(-100%);
      transition: transform .5s ease-out;

      :global(.sticky-menu) {
        position: relative;
        z-index: 1;
        width: 220px;
        border-radius: 0px 20px 20px 0px;
      }

      .menu-container:hover & {
        transform: translateX(0);
        .sliding-arrow {
          transform: translateX(-100%);
        }
      }
    }
  }

  .sliding-arrow {
    display: none;

    cursor: pointer;
    position: absolute;
    z-index: 0;
    width: 30px;
    left: 100%;
    top: 30px;
    bottom: 30px;
    max-height: 80px;
    transform-origin: 0% 0%;
    background: alpha($colors.neutral-dark, 0.2);
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
    border-radius: 0px 10px 10px 0px;
    transition: transform 0.1s ease-out;

    svg {
      width: 10px;
      fill: none;
      margin: auto;
      path {
        stroke: $colors.neutral-black ;
        stroke-width: 2.4px;
      }
    }

    +breakpoint(page, medium) {
      display: flex;
    }

    +breakpoint(page, small) {
      width: 18px;
      svg {
        width: 6px;
      }
    }
  }

  .content-carousel-container {
    overflow: hidden;
  }

  .madlib-container,
  .content-carousel-container {
    margin-left: -25px;
    grid-column: body / -1;
  }

</style>
