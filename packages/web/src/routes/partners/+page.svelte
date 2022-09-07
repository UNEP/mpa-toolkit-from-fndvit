<script lang="ts">
  import SplashStatic from "$lib/components/generic/SplashStatic.svelte";
  import ContentStatic from "$lib/components/generic/ContentStatic.svelte";
  import Footer from "$lib/components/shared/Footer.svelte";

  export let data: {content: string};
</script>

<SplashStatic page="Partners"/>
<ContentStatic content={data.content}/>
<Footer/>