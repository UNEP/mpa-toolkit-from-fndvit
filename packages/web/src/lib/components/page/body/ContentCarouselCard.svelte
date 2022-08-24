<script lang="ts">
  import type { Page } from '@mpa/db';
  import { TagContainer } from '$lib/components/shared';
  import { staticUrl } from '$lib/helpers/content';
  import { fallbackImage } from '$lib/helpers/utils';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';

  export let page: Page.ContentCard;

  const { slug, img, title, tags } = page;
  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;
</script>

<div class="content-carousel-card" tabindex="0">
  <a href={'/' + slug}>
    <img
      use:fallbackImage={fallbackImg}
      src={staticUrl(img) || fallbackImg}
      alt="interesting-chapters"
      href={'/' + slug}
    />
    <div class="title">{title}</div>
  </a>

  <div class="tags no-drag hide-scrollbar">
    <TagContainer {tags} />
  </div>
</div>

<style lang="stylus">
  .content-carousel-card {
    width: 292px;
    a {
      display: flex;
      flex-direction: column;
      row-gap: 0.6rem;
      padding-bottom: 1rem;
    }
    a:hover {
      text-decoration: none;
      img {
        filter: brightness(105%);
      }
      .title {
        color: #555;
      }
    }
  }

  .tags {
    line-height: 18px;
    max-width: 292px;
  }

  img {
    width: 100%;
  }

  .title {
    typography: h5-light;
    line-height: 1.5rem;
    padding-left: 0.15rem;
    color: black;
  }

  @media (max-width: 1320px) {
    .content-carousel-card {
      max-width: 210px;
    }
    .title {
      line-height: 22px;
    }

    .tags {
      overflow-x: scroll;
      > :global(.tag-container) {
        flex-wrap: nowrap;
      }
    }
  }

</style>
