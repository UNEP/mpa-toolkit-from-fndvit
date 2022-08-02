<script lang="ts">
  import type { SubTypes } from "$lib/types";

  export let pages: SubTypes.PageOrdering.PageOrdering[];
</script>

<div class="cms-pagesordering">

  <h3>PAGES ORDERING</h3>

    <div class="grid-links">
      {#each pages as page}
      <a href="/cms/pagesOrdering/{page.id}"><span class="material-icons">{page.icon}</span>{page.display}</a>
      {/each}
    </div>

</div>

<style lang="stylus">

  .material-icons {
    font-size: 77px;
  }

 .cms-pagesordering {

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h3 {
      typography: h3-light-responsive;
      margin-bottom: 40px;
      text-align: center;
    }

    a {
      typography: ui-small;
      color: black;
      text-decoration: none;
    }
  }

  .grid-links {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;
    justify-content: center;

    > :global(a) {
      typography: ui-small;
      text-transform: uppercase;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background: white;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      padding: 20px 10px 10px;
      width: 185px;
      height: 140px;
      box-sizing: border-box;

      &:hover {
        background: $colors.neutral-light;
        text-decoration: none;
      }
    }

  }

</style>
