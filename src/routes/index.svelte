<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import type { PageTag } from "$lib/prisma/queries";
  import LandingCarousel from "$lib/components/LandingCarousel.svelte";
  import Searchbar from "$lib/components/generic/Searchbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import landingSplash from '$lib/assets/landing-splash.jpg';
  import MpaManagementLifecycle from "$lib/components/MPAManagementLifecycle.svelte";
  import LandingMadlib from "$lib/components/Madlib/LandingMadLib.svelte";
  import InlineSvgLink from "$lib/components/generic/InlineSvgLink.svelte";
  import LandingSearchBar from "$lib/components/LandingSearchBar.svelte";

  export let chapters: SubTypes.Page.ContentCard[] = [];
  export let caseStudies: SubTypes.Page.ContentCard[] = [];
  export let tags: SubTypes.Tag[] = [];
  export let pageComponents: SubTypes.PageOrdering.PageComponents = null;

  let pageComponentsData = {
    "MpaManagementLifecycle": {
      data: null,
      component: MpaManagementLifecycle
    },
    "LandingCarouselChapters": {
      data: {
        pages: chapters,
        title: "Chapters"
      },
      component: LandingCarousel
    },
    "LandingCarouselCaseStudies": {
      data: {
        pages: caseStudies,
        title: "Case Studies"
      },
      component: LandingCarousel
    },
    "LandingMadlib": {
      data: null,
      component: LandingMadlib
    },
    "LandingSearchBar": {
      data: tags.map<PageTag>(t => ({tag: t, category: 'PRIMARY'})),
      component: LandingSearchBar
    },
  }

</script>

<svelte:head>
  <title>MPA Toolkit</title>
</svelte:head>

<div class="landing-page">
  <div class="unep-logo">
    <InlineSvgLink href="https://www.unep.org" svg="UNEP" newTab />
  </div>
  <div class="top-searchbar">
    <Searchbar type={'top'}/>
  </div>
  <div class="splash" style="background-image: url({landingSplash})">
    <h1>Here it is.<br><b>Your MPA toolkit.</b></h1>
    <h4>A brand-new, growing <b>educational platform</b> for the MPA community to share lessons, challenges and sustainable solutions.</h4>
    <h5>In partnership with</h5>
    <div class="partners-grid">
      <InlineSvgLink href="https://www.aics.gov.it/language/en/" svg="IAFDC" newTab />
      <InlineSvgLink href="https://www.uq.edu.au" svg="UoQ" newTab />
      <div class="partners-grid-2">
        <InlineSvgLink href="https://www.nature.org/" svg="TNC" newTab />
        <InlineSvgLink href="https://wwf.panda.org" svg="WWF" newTab />
      </div>
    </div>
  </div>

  {#each pageComponents?.components as component}
    <svelte:component this={pageComponentsData[component.component.name]?.component} data={pageComponentsData[component.component.name]?.data}/>
  {/each}

  <Footer/>
</div>


<style lang="stylus">

  .landing-page {
    background: $colors.neutral-bg;
    --page-padding: 6rem;
  }

  .inline-searchbar {
    width: 766px;
    margin: 50px auto;
    :global(.tag-container) {
      margin: 15px 13px 0;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 108px 185px 1fr;
    align-items: center;
    gap: 45px;
  }

  .partners-grid-2 {
    display: inherit;
    grid-template-columns: 168px 50px;
    align-items: inherit;
    gap: inherit;
  }

  .top-searchbar {
    position: absolute;
    margin: 2rem;
    right: 0px;
  }

  .splash {
    min-height: 60vh;
    padding: 6rem var(--page-padding) 3rem;
    background-size: cover;
    background-position: bottom;

    h1 {
      typography: h1-responsive;
      color: #FFFFFF;
      margin-bottom: 15px;
    }

    h4 {
      typography: h4-light;
      margin-top: 25px;
      margin-bottom: 80px;
      color: #FFFFFF;
      max-width: 800px;
    }

    h5 {
      typography: h5;
    }
  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
    color: white;
    width: 110px;
  }

  +breakpoint(page, medium) {

    .landing-page {
      --page-padding: 3rem;
    }

    .splash {
      background-position: left;

      h1 {
        padding-bottom: 4rem;
        padding-top: 4rem;
      }

      h4 {
        padding-bottom: 3rem;
      }

    }

    .unep-logo {
      margin-left: 3rem;
    }

    .inline-searchbar {
      width: auto;
      padding: 0 var(--page-padding);

      > :global(.tag-container) {
        flex-wrap: nowrap;
        overflow-x: scroll;
      }

    }

    .top-searchbar {

      :global(.placeholder) {
        display: none;
      }

      :global(.input-text) {
        max-width: 50px;
      }
    }
  }


  +breakpoint(page, small) {

    .inline-searchbar {
      margin: 0rem;
    }

    .landing-page {
      --page-padding: 1.5rem;
    }
    .splash {

      h1 {
        padding: 1rem 0rem;
      }

      h4 {
        margin-bottom: 1rem;
        padding: 1rem 0rem;
      }

    }

    .partners-grid {
      grid-template-columns: 100px 165px;
    }

    .partners-grid-2 {
      grid-template-columns: 146px 42px;
    }

    .top-searchbar {

      margin: 2rem 1rem;

      :global(.input-text) {
        max-width: 10px;
        padding: 7px
      }

      :global(.search-icon) {
        width: 20px;
        height: 20px;
      }
    }

    .unep-logo {
      width: 80px;
      margin-left: 2rem;
    }
  }

</style>
