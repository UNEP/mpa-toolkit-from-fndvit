<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { DiagramImage } from '@mpa/db';
  import * as api from '$lib/api';
  import { staticUrl } from '$lib/helpers/content';

  const dispatch = createEventDispatcher<{ save: DiagramImage }>();

  export let image: DiagramImage = { desktop: null, mobile: null };

  let imageMobile: HTMLInputElement, imageDesktop: HTMLInputElement;

  async function onSubmit() {
    dispatch('save', image);
  }

  const changeImage = async (img: 'mobile' | 'desktop', el: HTMLInputElement) => {
    const file = el.files[0];
    image[img] = await api.asset.upload(file);
    el.value = '';
  };
</script>

<form on:submit|preventDefault={onSubmit} class="diagram-layer-img-editor">
  <h4>Mobile</h4>
  {#if image.mobile}
    <img src={staticUrl(image.mobile)} alt="mobile" on:click={() => imageMobile.click()} />
  {:else}
    <button on:click|preventDefault={() => imageMobile.click()}>Upload</button>
  {/if}
  <h4>Desktop</h4>
  {#if image.desktop}
    <img src={staticUrl(image.desktop)} alt="desktop" on:click={() => imageDesktop.click()} />
  {:else}
    <button on:click|preventDefault={() => imageDesktop.click()}>Upload</button>
  {/if}

  <input type="file" bind:this={imageMobile} on:change={e => changeImage('mobile', e.currentTarget)} />
  <input type="file" bind:this={imageDesktop} on:change={e => changeImage('desktop', e.currentTarget)} />
  <input type="submit" class="button" value="SAVE" disabled={image.desktop == null || image.mobile == null} />
</form>

<style lang="stylus">

  .diagram-layer-img-editor {
    margin: 10px 0;

    .button {
      border: none;
      text-decoration: none;
      margin: 5px;
      margin: 10px;
      padding: 10px 15px;
      border-radius: 5px;

      &:hover {
        filter: brightness(105%);
      }

      &:focus {
        outline: none;
        border-bottom: solid 1px;
      }
    }

    input[type=file] {
      display: none;
    }


    img {
      max-width: 100px;
      cursor: pointer;
      &:hover {
        outline: 1px solid #777;
      }
    }
  }

</style>
