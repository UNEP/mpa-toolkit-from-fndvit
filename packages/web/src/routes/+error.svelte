<script>
  import { page } from '$app/stores';
  import turtle from '$lib/assets/error-default-image.png';
</script>

<div class="container">
  <h1>{$page.status} error</h1>
  {#if $page.status === 404}
    <div class="inner">
      <p>Erm ...<br>That's a bit awkward ...<br>But ...<br>We couldn't find that page<br>Try going to <a href="/">MPAth's home page</a>.</p>
      <div class="img" style="background-image: url({turtle})"/>
    </div>
  {:else}
    <div class="inner">
      <p>Ooops!!<br>This one's one us — something's not right on our side.<br>Refresh your browser or try us later maybe?</p>
      <div class="img" style="background-image: url({turtle})"/>
    </div>
  {/if}
</div>

<style lang="stylus">

  .container {
    margin: 3rem 3rem 3rem 3rem;
    color: $colors.neutral-dark;

    h1 {
      typography: h1-responsive;
      margin: 0;
    }

    p {
      typography: p-large-responsive;
    }

    a {
      font-weight: bold;
      color: $colors.neutral-dark;
    }
  }

  .img {
    width: 448px;
    height: 408px;
    filter: grayscale(100%) brightness(1.1);
    transform: translate(-45px, -100px);
  }

  .inner {
    display: flex;
    flex-direction: row;
  }

  +breakpoint(page, medium){

    .inner {
      flex-direction: column;
    }
  }

</style>
