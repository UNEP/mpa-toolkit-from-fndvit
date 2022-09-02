<script lang="ts">
  import InlineSvgLink from "$lib/components/generic/InlineSvgLink.svelte";
  import staticSplash from '$lib/assets/static-splash.png';
  import UpperMenu from "$lib/components/generic/UpperMenu.svelte";

  export let data;

  const dictionary = {
    'privacy-policy': "Privacy policy",
    team: "Team",
    'terms-of-use': "Terms of use",
    partners: "Partners",
    sitemap: "Sitemap"
  }

</script>

  <div class="splash" style="background-image: url({staticSplash})">
    <div class="upper-container">
      <div class="left-side">
        <InlineSvgLink href="/" svg="MPATH_W" />
      </div>
      <div class="right-side">
        <UpperMenu current={dictionary[data.slug]}/>
      </div>
    </div>

    <div class="title-container">
      <h1>{dictionary[data.slug]}</h1>
    </div>
  </div>

<style lang="stylus">

  .title-container {
    h1 {
      typography: h1-light-responsive;
      color: white;
    }
    margin-left: 96px;
  }

  .upper-container {
    width: 100%;
    display: flex;
  }

  .splash {
    min-height: 70vh;
    padding: 0rem 0rem 3rem;
    background-size: cover;
    background-position: bottom;
  }

  .left-side {
    margin: 2.5rem;
    margin-left: 96px;
    color: white;
    width: 110px;
    flex: 1;
  }

  .right-side {
    margin: 2.5rem;
    margin-right: 96px;
    flex: 1;
  }

</style>