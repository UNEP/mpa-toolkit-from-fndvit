<script lang="ts">
  import type { Page, Tag } from '@mpa/db';
  import MetadataIndexed from './MetadataIndexed.svelte';
  import MetadataUnindexed from './MetadataUnindexed.svelte';
  import { page } from '$app/stores';
  import chapterDefaultImage from '$lib/assets/chapter-default-image.jpg';
  import { getPageDisplayTitle } from '$lib/helpers/content';

  $: data = $page.data as { page?: Page; tag?: Tag; search?: string; title?: string };

  $: indexedRoutes = {
    '': {
      title: 'MPAth - Marine solutions hub',
      desc: 'A brand-new, growing educational platform for the MPA community to share lessons, challenges and sustainable solutions.',
      type: 'WebSite',
      image: chapterDefaultImage
    },
    '[slug]': {
      title: data.page ? getPageDisplayTitle(data.page) : '',
      desc: data.page?.chapter?.summary || data.page?.caseStudy.name,
      type: 'Article',
      image: chapterDefaultImage
    },
    'tag/[slug]': {
      title: data.tag?.value,
      desc: '',
      type: 'WebSite',
      image: chapterDefaultImage
    },
    search: {
      title: `"${data.search}"`,
      desc: '',
      type: 'WebSite',
      image: chapterDefaultImage
    },
    'author/[slug]': {
      title: data.title,
      desc: '',
      type: 'WebSite',
      image: chapterDefaultImage
    },
    'recommended/[slug]': {
      title: 'Recommended for you',
      desc: '',
      type: 'WebSite',
      image: chapterDefaultImage
    }
  } as const;

  $: unindexedRoutes = {
    'cms': 'CMS', // prettier-ignore
    'cms/login': 'Login',
    'cms/pages': 'CMS - Pages',
    'cms/tags': 'CMS - Tags',
    'cms/users': 'CMS - Users',
    'cms/authors': 'CMS - Authors',
    'cms/homepage': 'CMS - Homepage',
    'cms/pages/[id]': data.page ? `Edit page - ${getPageDisplayTitle(data.page)}` : 'Edit page',
    'cms/pages/create/chapter': 'New chapter',
    'cms/pages/create/case-study': 'New case study',
    'draft/[slug]': `[DRAFT] ${data.page ? getPageDisplayTitle(data.page) : ''}`
  };
</script>

{#if $page.routeId in indexedRoutes}
  <MetadataIndexed {...indexedRoutes[$page.routeId]} />
{:else if $page.routeId in unindexedRoutes}
  <MetadataUnindexed title={unindexedRoutes[$page.routeId]} />
{:else}
  <div class="metadata-warning">Missing metadata for this route: <span>{$page.routeId}</span></div>
{/if}

<style lang="stylus">
  .metadata-warning {
    background: #ff8585;
    padding: 10px;
    text-align: center;
    typography: ui-small;
    > span {
      margin-left: 5px;
      font-size: 13px;
    }
  }
</style>
