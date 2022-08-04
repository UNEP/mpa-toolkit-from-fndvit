<script lang="ts">
  import Dot from './Dot.svelte';

  export let progress = false;
  export let pagesCount = 1;
  export let currentPageIndex = 0;
</script>

<div class="carousel-dots">
  {#each Array(pagesCount) as _, i}
    <Dot
      {progress}
      on:click={() => currentPageIndex = i}
      active={currentPageIndex === i}
      on:progressAnimationFinished={() => currentPageIndex = i >= pagesCount - 1 ? 0 : i + 1}
    />
  {/each}
</div>

<style lang="stylus">

  .carousel-dots {
    display: flex;
    align-items: center;
    padding: 10px 30px;
    column-gap: 7px;
  }

</style>
