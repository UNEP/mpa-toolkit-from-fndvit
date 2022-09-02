<script lang="ts">
  import InlineSvgLink from "$lib/components/generic/InlineSvgLink.svelte";
  import staticSplash from '$lib/assets/static-splash.png';
  import UpperMenu from "$lib/components/generic/UpperMenu.svelte";

  export let data: {slug: string};

  let subtitle = "As of August 24, 2022";

  const pages = {
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
        <UpperMenu current={pages[data.slug]}/>
      </div>
    </div>

    <div class="title-container">
      <h1>{pages[data.slug]}</h1>
      <h4>{subtitle}</h4>
    </div>
  </div>

<style lang="stylus">

  .title-container {
    h1 {
      typography: h1-light-responsive;
      color: white;
      margin-bottom: 0.5rem;
    }
    h4 {
      typography: h4;
      color: white;
      margin-top: 0.5rem;
    }
    margin-left: var(--page-padding);
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
    --page-padding: 6rem;
  }

  .left-side {
    margin: 2.5rem;
    margin-left: var(--page-padding);
    color: white;
    width: 110px;
    flex: 1;
  }

  .right-side {
    margin: 2.5rem;
    margin-right: var(--page-padding);
    flex: 1;
  }

  +breakpoint(page, medium) {
    .splash {
      --page-padding: 3rem;
    }
  }

  +breakpoint(page, small) {
    .splash {
      --page-padding: 1.5rem;
    }
  }

</style>