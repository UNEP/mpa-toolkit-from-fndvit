<script lang="ts">
  import type { Author } from "$lib/types";
  import { staticUrl } from "$lib/helpers/content";
  import userNoProfileImage from '$lib/assets/default-profile-img.png';

  export let author: Pick<Author, 'img' | 'name'>;

  $: src = author.img ? staticUrl(author.img) : userNoProfileImage;

</script>

<img class="user-image" on:click {src} alt={author.name} />

<style lang="stylus">
  img {
    border-radius: 50%;
    width: 66px;
    height: 66px;
  }
</style>
