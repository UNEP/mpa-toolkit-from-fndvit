<script lang='ts'>
  import type { SubTypes, Tag } from "$lib/types";
  import CollectionPage from "$lib/components/pages/CollectionPage.svelte";
  import { setContext } from "svelte";

  export let pages: SubTypes.Page.CollectionCard[];
  export let tag: Tag;

  const tagHighlightFn = (t: SubTypes.Tag) => tag.id === t.id && `<b>${tag.value}</b>`;

  setContext('tagHighlightFn', tagHighlightFn);

</script>

<CollectionPage {pages} title={tag.value} bio={null}/>