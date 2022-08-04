<script lang="ts">
  import { session } from "$app/stores";

</script>

<div class="cms-homepage">

  {#if $session.user == null}

    <h2>WELCOME</h2>

    <a href="/api/auth/signin/google" class="signin-button">
      Sign in with Google
    </a>

  {:else}

    <h3>WELCOME {$session.user.name}</h3>

    <div class="grid-links">

      <a href="cms/pages"><span class="material-icons">description</span>Pages</a>
      <a href="cms/tags"><span class="material-icons">sell</span>Tags</a>
      <a href="cms/authors"><span class="material-icons">face</span>Authors</a>

      {#if $session.user.role == "ADMIN"}
        <a href="cms/users"><span class="material-icons">person</span>Users</a>
        <a href="cms/pagesOrdering"><span class="material-icons">sort</span>Page Ordering</a>
      {/if}

    </div>

    <div style="margin-top: 40px">
      <a href="/api/auth/signout">Signout</a>
    </div>
  {/if}
</div>

<style lang="stylus">

  .material-icons {
    font-size: 77px;
  }

 .cms-homepage {

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h2 {
      typography: h2-responsive;
      margin-bottom: 30px;
      text-align: center;
    }

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

  .signin-button {
    display: block;
    padding: 1.5rem;
    box-sizing: border-box;
    width: 275px;
    background: $colors.neutral-light;
    border-radius: 24px;
    &:hover {
      filter: brightness(105%);
    }
  }

  .grid-links {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;

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
