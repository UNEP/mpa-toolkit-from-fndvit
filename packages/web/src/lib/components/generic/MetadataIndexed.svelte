<script lang="ts">
  import type { WebSite, Article, WithContext } from 'schema-dts';
  import { jsonLdTemplate } from '$lib/helpers/utils';
  import { page } from '$app/stores';

  export let title: string;
  export let desc: string;
  export let image: string;
  export let type: 'WebSite' | 'Article';

  $: slug = $page.url.pathname + $page.url.search;
  $: ({ host, protocol } = $page.url);
  $: baseUrl = `${protocol}//${host}`;
  $: metaUrl = baseUrl + slug;

  function getJsonLd(_type: typeof type): WithContext<WebSite | Article> {
    const baseLd: WithContext<WebSite | Article> = {
      '@context': 'https://schema.org',
      '@type': _type,
      url: metaUrl,
      name: title,
      publisher: {
        '@type': 'Organization',
        name: 'MPath',
        logo: baseUrl + '/favicon.png'
      },
      description: desc
    };
    return _type === 'WebSite' ? baseLd : { ...baseLd, image };
  }

  $: jsonLd = type ? jsonLdTemplate(getJsonLd(type)) : '';
</script>

<svelte:head>
  <link rel="canonical" href={metaUrl} />

  <title>{title}</title>
  <meta name="title" content={title} />
  <meta name="description" content={desc} />

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content="MPAth" />
  <meta property="og:url" content={metaUrl} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={desc} />
  <meta property="og:image" content={image} />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={metaUrl} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={desc} />
  <meta property="twitter:image" content={image} />

  {@html jsonLd}
</svelte:head>
