<script>
  import { page } from '$app/stores';
</script>

<div class="container">
  <h1>{$page.status} error</h1>
  {#if $page.status === 404}
    <p>Erm ...<br>That's a bit awkward ...<br>But ...<br>We couldn't find that page<br>Try going to <a href="/">MPAth's home page</a>.</p>
  {:else}
    <div class="inner">
      <p>Ooops!!<br>This one's one us <br>— something's not right on our side.<br>Refresh your browser or try us later maybe?</p>
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

</style>
