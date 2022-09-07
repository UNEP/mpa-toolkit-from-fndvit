<script lang="ts">
  import SplashStatic from "$lib/components/generic/SplashStatic.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";
  import ContentStatic from "$lib/components/generic/ContentStatic.svelte";

  export let data: {lastUpdated: string, content: string};
</script>

<SplashStatic page="Privacy policy" subtitle="As of {data.lastUpdated}"/>
<ContentStatic content={data.content}/>
<Footer/>