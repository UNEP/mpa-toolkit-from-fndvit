<script lang="ts">
  import type { PageData } from './$types';
  import Page from '$lib/components/page/Page.svelte';
  export let data: PageData;
</script>

<Page {...data} />
