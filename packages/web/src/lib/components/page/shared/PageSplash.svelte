<script lang="ts">
  import type { Page } from '@mpa/db';
  import type { Modify } from '@mpa/utils';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { EditableText, InlineSvgLink } from '$lib/components/generic';
  import { staticUrl } from '$lib/helpers/content';
  import { fallbackBackgroundImage } from '$lib/helpers/utils';

  type PageForSplash = Modify<Pick<Page, 'title' | 'img'>, { caseStudy?: { name: string } }>;

  export let page: PageForSplash;
  export let editable = false;

  $: fallbackImg = page.caseStudy ? caseStudyDefaultImage : chapterDefaultImage;
</script>

<div class="unep-logo">
  <InlineSvgLink href="https://www.unep.org" svg="UNEP" newTab />
</div>
<div
  class="splash"
  style="background-image: url({staticUrl(page.img) || fallbackImg});"
  use:fallbackBackgroundImage={fallbackImg}
  class:splash-cs={page.caseStudy}
>
  <h1>
    {#if page.caseStudy}
      <EditableText bind:value={page.caseStudy.name} {editable} placeholder="Project name" />
      <span> &#x2013; </span>
    {/if}
    <EditableText bind:value={page.title} {editable} placeholder="Title" />
  </h1>
</div>

<style lang="stylus">

  .splash {
    grid-config(page, splash);
    grid-template-rows: 1fr auto;

    --ec-hover-bg: #ffffff22;
    --ui-color-placeholder: #ffffff55;
    min-height: 60vh;
    padding-bottom: 3rem;
    background-size: cover;
    background-position: center center;

    h1 {
      grid-area: title;
      typography: h1-responsive;
      color: white;
      text-shadow: 0px 2px 12px rgba(0, 0, 0, 0.45);
      > :global(*) {
        display: inline;
      }
      > :global(*:empty) {
        display: inline-block;
      }
    }

    &.splash-cs h1 > :global(*:first-child) {
      font-weight: 700;
    }

  }

  .unep-logo {
    position: absolute;
    margin: 2rem;
    width: 110px;
    color: white;
  }

  +breakpoint(page, medium)
    .splash {
      h1 {
        margin-bottom: 0px;
      }


      &.splash-cs h1 {
        padding-bottom: 5rem;
      }
    }
  +breakpoint(page, small)
      h1 {
        margin-top: 283px;
      }




</style>
