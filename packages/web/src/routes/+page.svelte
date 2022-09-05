<script lang="ts">
  import type { HomepageComponentName, PageTag } from '@mpa/db';
  import type { PageData } from './$types';
  import landingSplash from '$lib/assets/landing-splash.jpg';
  import { InlineSvgLink, Searchbar } from '$lib/components/generic';
  import { Footer, TagContainer } from '$lib/components/shared';
  import LandingCarousel from '$lib/components/homepage/LandingCarousel.svelte';
  import LandingMadLib from '$lib/components/homepage/LandingMadLib.svelte';
  import MpaManagementLifecycle from '$lib/components/homepage/MPAManagementLifecycle.svelte';

  export let data: PageData;
  let { chapters, caseStudies, tags, components } = data;

  const getComponentOrder = (name: HomepageComponentName): number => components.indexOf(name);

  const tagsForContainer = tags.map<PageTag>(t => ({ tag: t, category: 'PRIMARY' }));
</script>

<div class="landing-page">
  <div class="mpath-logo">
    <InlineSvgLink href="/" svg="MPATH" />
  </div>
  <div class="top-searchbar">
    <Searchbar type={'top'} />
  </div>
  <div class="splash" style="background-image: url({landingSplash})">
    <h1>Here it is.<br /><b>Your MPA toolkit.</b></h1>
    <h4>
      A brand-new, growing <b>educational platform</b> for the MPA community to share lessons, challenges and sustainable
      solutions.
    </h4>
    <h5>In partnership with</h5>
    <div class="partners-grid">
      <InlineSvgLink href="https://www.unep.org" svg="UNEP" newTab />
      <InlineSvgLink href="https://www.aics.gov.it/language/en/" svg="IAFDC" newTab />
      <InlineSvgLink href="https://wwf.panda.org" svg="WWF" newTab />
      <div class="partners-grid-2">
        <InlineSvgLink href="https://www.uq.edu.au" svg="UoQ" newTab />
        <InlineSvgLink href="https://www.nature.org/" svg="TNC" newTab />
      </div>
    </div>
  </div>

  <div class="ordered-components">
    <div style="order: {getComponentOrder('lifecycle')}">
      <MpaManagementLifecycle />
    </div>

    <div style="order: {getComponentOrder('chapters')}">
      <LandingCarousel pages={chapters} title="Get the <b>answers</b> to all your questions" />
    </div>

    <div style="order: {getComponentOrder('search')}" class="ordered-component inline-searchbar">
      <Searchbar type={'inline'} />
      <TagContainer tags={tagsForContainer} />
    </div>

    <div style="order: {getComponentOrder('madlib')}">
      <LandingMadLib />
    </div>

    <div style="order: {getComponentOrder('casestudies')}">
      <LandingCarousel pages={caseStudies} title="Explore what <b>others have done</b>" />
    </div>
  </div>

  <Footer />
</div>

<style lang="stylus">

  .landing-page {
    background: $colors.neutral-bg;
    --page-padding: 6rem;
  }

  .ordered-components {
    display: flex;
    flex-direction: column;
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
    grid-template-columns: 102px 87px 39px 1fr;
    align-items: center;
    gap: 45px;
  }

  .partners-grid-2 {
    display: inherit;
    grid-template-columns: 148px 135px;
    align-items: inherit;
    gap: inherit;
    color: inherit;
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

  .mpath-logo {
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

    .mpath-logo {
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
      grid-template-columns: 126px 87px 39px;
      grid-template-rows: auto;
      margin-top: 1rem;
    }

    .partners-grid-2 {
      grid-template-columns: 148px 135px;
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

    .mpath-logo {
      width: 80px;
      margin-left: 2rem;
    }
  }

</style>
