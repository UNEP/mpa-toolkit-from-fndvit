<script lang="ts">
  import type { ImageBlock } from '@mpa/db';
  import type { SvelteNodeViewControls } from 'prosemirror-svelte-nodeview';
  import imagePlaceholder from '$lib/assets/image-placeholder.svg';
  import { IconButton } from '$lib/components/generic';
  import { staticUrl } from '$lib/helpers/content';
  import { fallbackImage } from '$lib/helpers/utils';

  export var attrs: ImageBlock['attrs'];
  export var controls: SvelteNodeViewControls;
  export var selected = false;

  const toggleStyle = () => {
    attrs.style = attrs.style === 'regular' ? 'full' : 'regular';
  };
</script>

<div class="imageview imageview-{attrs.style}" class:selected contenteditable="false">
  <div class="image-controls">
    <input bind:value={attrs.alt} placeholder="alt text..." />
    <IconButton icon="aspect_ratio" title="Wide" active={attrs.style === 'full'} on:click={toggleStyle} />
    <IconButton on:click={controls.delete} icon="delete" />
  </div>
  <img use:fallbackImage={imagePlaceholder} src={staticUrl(attrs.src)} alt={attrs.alt} title={attrs.title} />
</div>

<style lang="stylus">

  :global(.svelte-node-view.ProseMirror-selectednode) .imageview {
    outline: 1px solid #333333aa;
  }

  .imageview {
    font-size: 0;
    position: relative;
    &.selected:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: 1px solid #777;
      margin: -1px;
      pointer-events: none;
    }
  }

  .imageview-full {
    margin-left: -100px;
    margin-right: -100px;
  }

  .image-controls {
    --ib-icon-bg: #ffffff77;
    --ib-hover-icon-bg: #ffffffcc;

    .imageview-full & :global([data-id="aspect_ratio"]) {
      --ib-active-bg: white;
    }

    padding: 5px;
    font-size: 16px;
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    .imageview:not(:hover) & {
      display: none;
    }
    display: flex;
    column-gap: 5px;
    input {
      flex: 1;
    }
  }

  img {
    width: 100%;
  }

</style>
