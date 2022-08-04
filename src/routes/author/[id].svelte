<script lang='ts'>
  import type { Author, SubTypes } from "$lib/types";
  import CollectionPage from "$lib/components/pages/CollectionPage.svelte";

  export let pages: SubTypes.Page.CollectionCard[];
  export let _author: Author;

</script>

<CollectionPage {pages} title={_author.name} bio={_author.bio}/>
