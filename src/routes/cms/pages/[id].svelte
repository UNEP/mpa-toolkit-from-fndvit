<script lang="ts">
  import PageEditor from "$lib/components/cms/PageEditor.svelte";
  import type { SubTypes, Tag } from "$lib/types";

  export let authors: SubTypes.Author[];
  export let page: SubTypes.Page.Full = {} as SubTypes.Page.Full;
  export let allTags: Tag[];
</script>

<PageEditor {authors} {page} {allTags} />