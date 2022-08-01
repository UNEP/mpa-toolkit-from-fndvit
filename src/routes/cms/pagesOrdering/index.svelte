<script lang="ts">
  import type { SubTypes } from "$lib/types";

  export let pages: SubTypes.PageOrdering.PageOrdering[];

</script>

<div class="container">
  {#each pages as page}
    <div class="item">
      <a class="name" href={"/cms/pagesOrdering/" + page.id}>{page.name}</a>
    </div>
  {/each}
</div>

<style lang="stylus">
  .container{
    cursor: pointer;
    width: 50%;
    margin: 0 auto;

  }
  .item{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
  }
</style>