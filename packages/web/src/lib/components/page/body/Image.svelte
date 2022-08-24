<script lang="ts">
  import type { ImageBlock } from '@mpa/db';
  import { staticUrl } from '$lib/helpers/content';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';
  import { fallbackImage } from '$lib/helpers/utils';

  export let block: ImageBlock;
</script>

<div class="image image-{block.attrs.style || 'regular'}">
  <img src={staticUrl(block.attrs.src)} use:fallbackImage={imagePlaceholder} alt={block.attrs.alt} />
</div>

<style lang="stylus">

  .image-full {
    margin-left: calc(-1 * var(--img-full-breakout-l, 200px));
    margin-right: calc(-1 * var(--img-full-breakout-r, 200px));
  }

  .image img {
    width: 100%;
  }

</style>
