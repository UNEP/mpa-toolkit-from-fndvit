<script lang="ts">
  import type { Author } from '@mpa/db';
  import userNoProfileImage from '$lib/assets/default-profile-img.png';
  import { staticUrl } from '$lib/helpers/content';
  import { fallbackImage } from '$lib/helpers/utils';

  export let author: Pick<Author.DB, 'img' | 'name'>;
</script>

<img
  class="user-image"
  on:click
  src={staticUrl(author.img) || userNoProfileImage}
  use:fallbackImage={userNoProfileImage}
  alt={author.name}
/>

<style lang="stylus">
  img {
    border-radius: 50%;
    width: 66px;
    height: 66px;
  }
</style>
