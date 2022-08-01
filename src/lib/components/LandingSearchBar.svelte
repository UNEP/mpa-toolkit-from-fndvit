<script lang="ts">
  import Searchbar from "./generic/Searchbar.svelte";
  import TagContainer from "./TagContainer.svelte";
  import type { Tag, TagCategory } from "$lib/types";

  export let data : {tag: Tag, category: TagCategory}[];
</script>

<div class="inline-searchbar">
  <Searchbar type={'inline'}/>
  <TagContainer tags={data}/>
</div>

<style lang="stylus">
  .inline-searchbar {
    width: 766px;
    margin: 50px auto;
    :global(.tag-container) {
      margin: 15px 13px 0;
    }
  }
</style>