<script lang="ts">
  import { InlineSvg } from '$lib/components/generic';
  import type * as svgs from '$lib/svg';

  export let href: string;
  export let svg: keyof typeof svgs;
  export let newTab = false;
  export let download: string = undefined;

  const props = {
    target: newTab ? '_blank' : undefined,
    download
  };
</script>

<a {href} {...props}><InlineSvg {svg} /><slot /></a>

<style lang="stylus">
  a
    color: inherit
</style>
