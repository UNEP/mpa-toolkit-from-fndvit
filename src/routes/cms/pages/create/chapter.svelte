<script lang="ts">
  import PageEditor from "$lib/components/cms/PageEditor.svelte";
  import { createEmptyPage } from "$lib/helpers/content";
  import type { Tag, SubTypes } from "$lib/types";

  export let authors: SubTypes.Author[];
  export let allTags: Tag[];
  const page = createEmptyPage('chapter');
</script>

<PageEditor {authors} {allTags} {page} />