<script lang="ts">
  import type { DiagramImage } from '@mpa/db';
  import { createEventDispatcher } from 'svelte';
  import IconButton from '../generic/IconButton.svelte';
  import { Spinner } from '../generic';
  import * as api from '$lib/api';
  import { staticUrl } from '$lib/helpers/content';

  export let title: string;
  export let image: DiagramImage;
  export let edit: boolean;
  export let highlight = false;
  export let deletable = true;

  const imgTypes = ['mobile', 'desktop'] as const;

  let dragging = false;

  let loading = {
    mobile: false,
    desktop: false
  };

  let inputEls: { mobile: HTMLInputElement; desktop: HTMLInputElement } = {
    mobile: null,
    desktop: null
  };

  async function changeImage(img: 'mobile' | 'desktop', el: HTMLInputElement) {
    const file = el.files[0];
    if (file) {
      loading[img] = true;
      const url = await api.asset.upload(file);
      if (url == image[img]) loading[img] = false;
      image[img] = url;
    }
  }

  function onClickPreview(img: 'mobile' | 'desktop') {
    inputEls[img].value = null;
    inputEls[img].click();
  }

  function onLoad(img: `mobile` | 'desktop') {
    loading[img] = false;
    dispatch('update');
  }

  const dispatch = createEventDispatcher<{ delete: null; update: null }>();
</script>

<div
  class="layer-list-item"
  class:layer-list-item--higlight={highlight}
  on:click|stopPropagation
  class:dragging
  draggable="true"
  on:dragstart={() => (dragging = true)}
  on:dragend={() => (dragging = false)}
>
  <span class="layer-title">{title}</span>
  <div class="icons" style={!deletable ? `visibility: hidden;` : undefined}>
    <IconButton icon="delete" on:click={() => dispatch('delete')} />
  </div>

  {#if edit}
    <div class="edit-popup">
      {#each imgTypes as img}
        <div class="layer-preview" on:click={() => onClickPreview(img)}>
          <h4>{img}</h4>
          {#if image[img]}
            {#if loading[img]}<Spinner />{/if}
            <img
              on:load={() => onLoad(img)}
              style={loading[img] ? `visibility: hidden;` : undefined}
              src={staticUrl(image[img])}
              alt={img}
            />
          {:else}
            <button>Upload</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  <input type="file" bind:this={inputEls.mobile} on:change={e => changeImage('mobile', e.currentTarget)} />
  <input type="file" bind:this={inputEls.desktop} on:change={e => changeImage('desktop', e.currentTarget)} />
</div>

<style lang="stylus">

  .layer-list-item {
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    typography: ui;
    align-items: center;
    padding-left: 5px;
    margin-left: -5px;

    &:hover {
      outline: 1px solid $colors.secondary-bg;
    }

    &.layer-list-item--higlight {
      background: $colors.neutral-bg;
      outline: 1px solid $colors.secondary-bg;
    }

    input[type=file] {
      display: none;
    }

    &:not(:hover) .icons {
      visibility: hidden;
    }
    --ib-hover-bg: white;
    --ib-hover-border: 1px solid $colors.secondary-bg;
  }

  .layer-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .edit-popup {
    position: absolute;
    top: 50%;
    right: calc(100% + 12px);
    background: white;
    border-radius: 4px;
    z-index: $z-index.tooltip;
    padding: 10px;
    filter: drop-shadow(0 0 5px #2a2a2a66);
    transform: translateY(-50%);
    display: flex;
    column-gap: 4px;

    .dragging & {
      display: none;
    }

    button {
      cursor: pointer;
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      right: -5px;
      background: white;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
      top: 50%;
    }

    h4 {
      margin: 0 0 10px;
      text-transform: capitalize;
    }

  }
  .layer-preview {
    cursor: pointer;
    padding: 10px;
    width: 100px;
    position: relative;
    img {
      max-width: 100%;
      outline: 1px solid $colors.secondary-bg;
    }

    :global(.spinner) {
      position: absolute;
      width: 100%;
      margin: auto;
      margin-top: 10px;
    }

    &:hover {
      background: white;
      outline: 1px solid $colors.secondary-bg;
      filter: drop-shadow(0 0 2px #2a2a2a33);
    }
  }
</style>
