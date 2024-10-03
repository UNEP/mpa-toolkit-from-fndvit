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
  let { tags, components } = data;

  const tagsForContainer = tags.map<PageTag>(t => ({ tag: t, category: 'PRIMARY' }));

  const orderStyle = (el: HTMLElement, name: HomepageComponentName) => {
    el.style.order = components.indexOf(name).toString();
  };
</script>

<div class="landing-page">
  <div class="mpath-logo">
    <InlineSvgLink href="/" svg="UNEP" />
  </div>
  <div class="top-searchbar">
    <Searchbar type={'top'} />
  </div>
  <div class="splash" style={`background-image: url(${landingSplash})`}>
    <h1>Here it is: <b>MPAth</b></h1>
    <h4>
      The “Marine Protected Area Tool Hub” is an <a class="inline-link" href="/using-mpath/">educational platform</a> that is practitioner-focused at every level and developed to help you with your personalised challenges.
    </h4>
    <h5>UNEP, in partnership with</h5>
    <div class="partners-grid">
      <div class="partners-grid-1">
        <InlineSvgLink href="https://www.aics.gov.it/language/en/" svg="IAFDC" newTab />
        <InlineSvgLink href="https://www.uq.edu.au" svg="UoQ" newTab />
      </div>
      <div class="partners-grid-2">
        <InlineSvgLink href="https://www.nature.org/" svg="TNC" newTab />
        <InlineSvgLink href="https://wwf.panda.org" svg="WWF" newTab />
      </div>
      <div class="partners-grid-3">
        <InlineSvgLink href="https://coralreefrescueinitiative.org/" svg="CRRI" newTab />
        <InlineSvgLink href="https://www.udg.edu/en/" svg="UdG" newTab />
        <InlineSvgLink href="https://www.fundaciovit.org/" svg="ViT" newTab />
      </div>
    </div>
  </div>

  <div class="ordered-components">
    <div use:orderStyle={'lifecycle'}>
      <MpaManagementLifecycle />
    </div>

    <div use:orderStyle={'chapters'}>
      <LandingCarousel title="A <b>smart</b> knowledge hub that <b>helps you</b> find what you need" type={'chapter'} />
    </div>

    <div use:orderStyle={'search'} class="ordered-component inline-searchbar">
      <Searchbar type={'inline'} />
      <TagContainer tags={tagsForContainer} />
    </div>

    <div use:orderStyle={'madlib'}>
      <LandingMadLib />
    </div>

    <div use:orderStyle={'casestudies'}>
      <LandingCarousel title="Explore what <b>others have done</b>" type={'case-study'} />
    </div>
  </div>

  <Footer />
</div>

<style lang="postcss">
  .landing-page {
    background: $c-neutral-bg;

    --page-padding: 6rem;
  }

  .ordered-components {
    display: flex;
    flex-direction: column;
  }

  .inline-searchbar {
    max-width: 766px;
    margin: 50px auto 25px;

    :global(.tag-container) {
      margin: 15px 13px 0;
    }
  }

  .partners-grid {
    display: grid;
    grid-template-columns: 260px 220px 100px;
    grid-template-rows: auto;
    align-items: center;
    gap: 45px;
    row-gap:24px;
  }

  .partners-grid-1 {
    display: inherit;
    grid-template-columns: 87px 148px 1fr;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .partners-grid-2 {
    display: inherit;
    grid-template-columns: 135px 39px;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .partners-grid-3 {
    display: inherit;
    grid-template-columns: 90px 100px 64px;
    align-items: inherit;
    gap: inherit;
    color: inherit;
  }

  .inline-link {
    color: inherit;
    opacity: .85;
    transition: 0.3s all;
    text-decoration: none;
    border-bottom: 1px white dotted;
    font-weight: 600;
  }

  .inline-link:hover {
    text-decoration: none;
    opacity: .6;
    border-bottom: 1px white solid;
  }

  .top-searchbar {
    position: absolute;
    margin: 2rem;
    right: 0;
  }

  .splash {
    min-height: 60vh;
    padding: 6rem var(--page-padding) 3rem;
    background-size: cover;
    background-position: bottom;

    h1 {
      @mixin font-responsive h1;

      color: #fff;
      margin-bottom: 15px;
    }

    h4 {
      font: $f-h4-light;
      margin-top: 25px;
      margin-bottom: 80px;
      color: #fff;
      max-width: 800px;
    }

    h5 {
      font: $f-h5;
    }
  }

  .mpath-logo {
    position: absolute;
    margin: 2rem;
    color: white;
    width: 110px;
  }

  @mixin breakpoint content, medium {
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
      max-width: 700px;
      padding: 0 var(--page-padding);
      margin-bottom: 0;

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

  @mixin breakpoint content, small {
    .inline-searchbar {
      margin: 35px 0 0;
    }

    .landing-page {
      --page-padding: 1.5rem;
    }

    .splash {
      h1 {
        padding: 1rem 0;
      }

      h4 {
        margin-bottom: 1rem;
        padding: 1rem 0;
      }
    }

    .partners-grid {
      grid-template-columns: auto;
      grid-template-rows: auto;
      margin-top: 1rem;
    }

    .partners-grid-1 {
      grid-template-columns: 87px 148px;
    }

    .partners-grid-2 {
      grid-template-columns: 135px 39px;
    }

    .partners-grid-3 {
      grid-template-columns: 90px 100px 64px;
    }
    .top-searchbar {
      margin: 2rem 1rem;

      :global(.input-text) {
        max-width: 10px;
        padding: 7px;
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
