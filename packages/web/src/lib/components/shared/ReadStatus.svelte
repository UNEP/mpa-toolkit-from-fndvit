<script lang="ts">
  export let read = false;
</script>

{#if read}
  <div class="container">
    <div class="read-mark">
      <p>Already read</p>
      <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
        <path
          d="M6.42857 13L0 6.75715L1.81671 4.99328L6.42857 9.46975L16.1807 0L18 1.76637L6.42857 13Z"
          fill="#D9D9D9"
        />
      </svg>
    </div>
  </div>
{/if}

<style lang="stylus">

  .read-mark {
    display: flex;
    color: $colors.neutral-light;
    border: 1px solid $colors.neutral-light;
    border-radius: 18px;
    background-color: rgba(255, 255, 255, 0.1);
    filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.25));

    p {
      typography: ui-small;
      margin: 5px 10px;
      flex: 1;
    }

    svg {
      margin: auto;
      padding: 5px 10px 5px 0px;
    }

  }

  .container {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(9, 110, 174, .7);
  }

  +breakpoint(page, medium){
    .read-mark {
      p {
        display: none;
      }
      svg {
        margin: auto;
        padding: 10px 10px 10px 10px;
      }
    }
  }

</style>
