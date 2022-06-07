<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import StickyMenu from "../StickyMenu/StickyMenu.svelte";
  import Section from "./Section.svelte";
  import { createSections } from "$lib/helpers/content";
  import Heading from "./Heading.svelte";
  import Paragraph from "./Paragraph.svelte";
  import TextSlider from "./TextSlider.svelte";
  import ContentMadLib from "$lib/components/Madlib/ContentMadLib.svelte";
  import TinyCarousel from "$lib/components/TinyCarousel.svelte";
  import LifeCycle from "$lib/components/LifeCycle.svelte";
  import Image from "./Image.svelte";

  export let page: SubTypes.Page.Full;
  export let recommendedPages: SubTypes.Page.ContentCard[] = null;

  const sections = createSections(page.content);

  const components = {
    'heading': Heading,
    'paragraph': Paragraph,
    'cards' : TextSlider,
    'image': Image,
  };

  const headings = sections.filter(s => s.id);

</script>

<div class="page-content">
  <div class="menu">
    <StickyMenu menuOptions={headings} />
  </div>
  <div class="lifecycle-container">
    <LifeCycle tags={page.tags}/>
  </div>
  <div class="body-column">
    {#each sections as section, i}
      <Section {section}>
        {#each section.blocks as block}
          {#if components[block.type]}
            <svelte:component this={components[block.type]} {block} />
          {:else}
            <div class="unknown-block">
              Unknown block type: {block.type}
            </div>
          {/if}
        {/each}
      </Section>

      {#if sections.length > 1 }
        {#if i === 0}
          <div class="madlib-container">
            <ContentMadLib />
          </div>
        {:else if i === 2 && recommendedPages?.length > 0}
          <div class="tiny-carousel-container">
            <TinyCarousel slides={recommendedPages} title={'You may also like'}/>
          </div>
        {/if}
      {/if}
      {/each}
    </div>
</div>

<style lang="scss">

  .page-content {
    position: relative;
    display: grid;
    grid-template-columns: minmax(250px, 500px) minmax(32rem, 40rem) minmax(300px, auto);
    grid-template-areas: "left-margin body right-margin";
    grid-auto-flow: row;
    column-gap: 1.5rem;
    padding: 0 20px;
  }

  .body-column {
    display: contents;
    font-family: var(--font-serif);
    font-size: 18px;
    line-height: 32px;
    > :global(*) {
      grid-column-start: body;
    }
  }

  .unknown-block {
    background: #fca5a5;
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 1rem -1rem;
  }

  .menu {
    grid-area: left-margin;
    top: 10px;
    padding-right: 1rem;
    :global(.mainnav) {
      position: sticky;
      float: right;
      top: 10px;
      flex: 0;
    }
  }

  .lifecycle-container {
    grid-area: right-margin;
    padding-top: 1.5rem;
    transform: translate(0, -350px);
    justify-self: flex-start;
    :global(.lifecycle) {
      margin: auto;
      max-width: 300px;
    }
  }

  .tiny-carousel-container {
    overflow: hidden;
  }

  .madlib-container,
  .tiny-carousel-container {
      margin-left: -25px;
      margin-right: -20px;
      grid-column: body / right-margin;
  }

  @media screen and (max-width: 1150px) {
    .page-content {
      grid-template-columns: 250px minmax(500px, 600px) minmax(20px, auto);
    }
    .body-column {
      :global(.tiny-carousel) {
        width: auto;
      }
    }
    .lifecycle-container {
      transform: translate(0, 0px);
      grid-area: body;
      grid-row: 1;
      :global(.lifecycle) {
        max-width: none;
        :global(.popup-body){
          width: 450px;
        }
      }
    }
  }
  @media screen and (max-width: 840px) {
    .page-content {
      display: block;
    }

    .madlib-container {
      margin-top: 1rem;
      margin-right: 0;
    }

    .body-column {
      font-size: 16px;
      line-height: 28px;
      > :global(.content-section) {
        max-width: 480px;
        margin: auto;
      }

      :global(img) {
        max-width: 100%;
      }
    }

    .menu {
      display: none; //temporary
    }

  }
  @media (max-width: 540px) {
    .lifecycle-container{
      :global(.lifecycle) {
        :global(.popup-body){
          width: 320px;
        }
      }
    }
  }

</style>