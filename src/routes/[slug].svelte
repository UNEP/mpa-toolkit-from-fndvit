<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import Page from "$lib/components/pages/Page.svelte";
  import Metadata from "./tag/Metadata.svelte";

  export let page: SubTypes.Page.Full;
  export let recommendedPages: SubTypes.Page.ContentCard[];

  let desc = page.chapter ? page.chapter.summary : page.caseStudy.name;

</script>

<svelte:head>
  <Metadata
    title={page.title}
    slug={page.slug}
    type="article"
    {desc}
    image={page.img}
  />
</svelte:head>

<Page {page} {recommendedPages} />
