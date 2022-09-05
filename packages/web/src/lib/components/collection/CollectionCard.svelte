<script lang="ts">
  import type { Page, TagType } from '@mpa/db';
  import caseStudyDefaultImage from '$lib/assets/casestudy-default-image.jpg';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { TagContainer } from '$lib/components/shared';
  import { getPageDisplayTitle, staticUrl } from '$lib/helpers/content';
  import { fallbackBackgroundImage } from '$lib/helpers/utils';

  export let page: Page.CollectionCard;
  export let tagType: TagType = 'TOPIC';
  export let cms = false;

  const TITLES: { [key in TagType]: string } = {
    TOPIC: "What's this about",
    USER: 'Good for...',
    STAGE: 'MPA lifecycle'
  };

  $: authors = page.chapter?.authors?.map(a => a.name);
  $: authorsString =
    authors &&
    (authors.length > 1 ? `${authors.slice(0, -1).join(', ')} and ${authors.slice(-1)}` : authors.toString());

  $: href = cms ? `/cms/pages/${page.id}` : `/${page.slug}`;
  $: fallbackImg = page.chapter ? chapterDefaultImage : caseStudyDefaultImage;

  $: tags = page.tags.filter(t => t.tag.type === tagType);
</script>

<a class="collection-card" {href} rel="external" class:cms-card={cms}>
  <div
    class="image"
    style="background-image: url({staticUrl(page.img) || fallbackImg});"
    use:fallbackBackgroundImage={fallbackImg}
  />
  <div class="content">
    <h1 class="title">
      {#if page.highlights}
        {@html page.highlights}
      {:else}
        {getPageDisplayTitle(page)}
      {/if}
    </h1>
    <div class="byline">
      {#if authorsString}
        <div class="authors">{authorsString}</div>
      {/if}
      <div class="read-time">{page.readTime} min read</div>
    </div>
    <div class="tags">
      <h3>{TITLES[tagType]}</h3>
      <TagContainer {tags} />
    </div>
  </div>
</a>

<style lang="stylus">
  .collection-card {
    --cc-height: 200px;
    display: flex;
    background: $colors.neutral-bg;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    height: var(--cc-height);
    margin: 0;

    &:hover {
      text-decoration: none;
      filter: brightness(105%);
    }

    &.cms-card {
      --cc-height: 160px;
    }
  }

  a.collection-card {
    color: inherit;
  }

  .content {
    padding: 0.75rem 1rem 1rem 1.5rem;
    flex: 1;
    display: grid;
    grid-template-areas:
      "title  tags"\
      "byline tags";
    grid-template-columns: 1fr 300px;
    grid-template-rows: 1fr auto;
    column-gap: 1rem;
  }

  .title {
    grid-area: title;
    typography: h4-light-responsive;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-width: 800px;
  }

  .byline {
    grid-area: byline;
    display: flex;
    column-gap: 0.4rem;
    color: $colors.neutral-dark;
  }

  .tags {
    grid-area: tags;
    display: flex;
    flex-direction: column;
    row-gap: 0.6rem;
    h3 {
      typography: h5;
      margin: 0;
      margin-top: 0.3rem;
    }
  }

  .title {
    margin: 0px;
  }

  .authors {
    typography: h5-responsive;
  }

  .read-time {
    typography: ui;
  }

  .image {
    flex: 0 0 12rem;
    object-fit: cover;
    border-radius: 12px 0px 0px 12px;
    background-size: cover;
    background-position: center center;
  }

  @media (max-width: 1024px) {

    .collection-card {
      height: auto;
    }

    .image {
      flex-basis: 7rem;
    }
    .content {
      padding: 0.5rem 0.75rem 1rem 1rem;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto auto;
      grid-template-areas: "title" "byline" "tags";
      row-gap: 1rem;
    }
    .title {
      -webkit-line-clamp: 5;
      line-clamp: 5;
    }
    .byline {
      flex-direction: column;
      align-items: initial;
      row-gap: 0.4rem;
    }
    .tags {
      overflow: hidden;
      h3 {
        display: none;
      }
      > :global(.tag-container) {
        flex-wrap: nowrap;
        overflow-x: scroll;
      }

    }
  }
</style>
