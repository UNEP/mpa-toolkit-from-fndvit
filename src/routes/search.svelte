<script lang='ts'>
  import CollectionPage from "$lib/components/pages/CollectionPage.svelte";
  import type { SubTypes } from "$lib/types";
  import { setContext } from "svelte";

  export let pages: SubTypes.Page.CollectionCard[];
  export let search: string;
  export let tagHighlights: { [tagId: number]: string };

  const tagHighlightFn = (tag: SubTypes.Tag) => tagHighlights[tag.id];

  setContext('tagHighlightFn', tagHighlightFn);

</script>

<CollectionPage {pages} title={search} {search} bio={null}/>
