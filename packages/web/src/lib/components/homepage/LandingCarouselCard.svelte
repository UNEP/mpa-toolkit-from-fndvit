<script lang="ts">
  import type { Page } from '@mpa/db';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { TagContainer } from '$lib/components/shared';
  import { getPageDisplayTitle, staticUrl } from '$lib/helpers/content';
  import { fallbackImage } from '$lib/helpers/utils';

  export let page: Page.ContentCard;

  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;
</script>

<a class="landing-carousel-card" href="/{page.slug}" class:case-study={!!page.caseStudy} tabindex="0" rel="external">
  <img use:fallbackImage={fallbackImg} class="image" src={staticUrl(page.img) || fallbackImg} alt="preview" />

  <div class="preview-content">
    <div class="title">
      <span><h3>{getPageDisplayTitle(page)}</h3></span>
      <div class="circle-button" tabindex="0">
        <svg class="arrow-svg" viewBox="0 0 12 20">
          <path class="arrow-path" d="M1.1814 19L9.81849 10L1.1814 1" />
        </svg>
      </div>
    </div>

    <div>
      <div class="tags-title">
        <h5>What's this about?</h5>
      </div>
      <div class="tags no-drag hide-scrollbar">
        <TagContainer tags={page.tags} />
      </div>
    </div>
  </div>
</a>

<style lang="stylus">

  .landing-carousel-card {
    display: flex;
    flex-direction: column;
    width: 766px;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 40px;
    border: none;
    background: $colors.primary-blue;
    height: 100%;

    &.case-study {
      background: $colors.deep-blue;
    }

    &:hover {
      filter: brightness(105%);
    }

    .tags {
      max-width: 600px;
    }

  }

  a.landing-carousel-card {
    text-decoration: none;
  }

  .arrow-svg {
    width: 12px;
    height: 20px;
    fill: none;
    transform: translateX(2px);
  }

  .arrow-path {
    stroke:$colors.neutral-black ;
    stroke-width: 2.4px;
  }

  .circle-button {
    display: flex;
    flex: 0 0 72px;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: $colors.highlight-1;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
  }

  .circle-button:hover{
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.35);
  }

  .tags-title {
    margin: 2.5rem 0 1rem;

    h5 {
      typography: h5;
      margin: 0;
    }
  }

  .title {
    $max-lines = 4;
    text-overflow: clip;
    word-wrap: break-word;
    display: flex;
    justify-content: space-between;
    > span {
      flex: 0 1 570px;
      display: -webkit-box;
      -webkit-line-clamp: $max-lines;
      line-clamp: $max-lines;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
    }

    h3 {
      typography: h3-light-responsive;
      margin: 0;
    }
  }

  .preview-content {
    color: #FFFFFF;
    padding: 2rem 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .image {
    border-radius: 40px 40px 0px 0px;
    width: 766px;
    height: 344px;
    object-fit: cover;
  }

  @media(max-width: 1024px) {

    .landing-carousel-card {
      max-width: 500px;
      width: calc(100vw - 120px);
    }

    .image {
      width: 100%;
      aspect-ratio: 1.5 / 1;
      @supports (aspect-ratio: 1.25 / 1) {
        height: auto;
        min-height: 240px;
      }
    }

    .circle-button, .tags-title {
      display: none;
    }

    .preview-content {
      padding: 1rem 1.5rem 1.5rem;
    }

    .tags {
      margin-top: 2rem;
      overflow-x: scroll;
      > :global(.tag-container) {
        flex-wrap: nowrap;
      }
    }

  }

  @media(max-width: 550px) {

    .landing-carousel-card {
      max-width: 500px;
      width: calc(100vw - 80px);
    }

  }

</style>
