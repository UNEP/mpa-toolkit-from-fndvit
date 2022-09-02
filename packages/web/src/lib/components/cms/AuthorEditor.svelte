<script lang="ts">
  import type { Author } from '@mpa/db';
  import EditableAuthorImage from './EditableAuthorImage.svelte';
  import * as api from '$lib/api';
  import { toaster } from '$lib/components/generic';

  export let author: Author.ForCMS;

  async function onChangeAuthor() {
    if (author.id != null) {
      toaster.report(
        () => api.author.update(author.id, { name: author.name, bio: author.bio ?? undefined }),
        'Author updated',
        'Error updating author'
      );
    }
  };


  $: if (author.name != null) {
    if (author.name.length > 30) toaster.info(`The name can have a maximum of 30 letters only`);
  }
</script>

<div class="author-editor">
  <div>
    {#if author.id != null}
      <EditableAuthorImage bind:author />
    {/if}
  </div>
  <div>
    <input type="text" bind:value={author.name} on:change={onChangeAuthor} placeholder="Enter a name..." />
  </div>
  <div>
    <textarea rows="4" bind:value={author.bio} on:change={onChangeAuthor} placeholder="Enter a biography..." />
  </div>
</div>

<style lang="stylus">

  .author-editor {
    display: grid;
    grid-template-columns: 90px 1fr 2.25fr;
    column-gap: 15px;
    margin-top: 20px;
    width: 90%;

    input, textarea {

      border: none;
      margin: 1.2rem;
      text-decoration: none;
      width: 100%;
      resize: none;
      typography: ui;

      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 5px;
      }

      &:focus {
        outline: none;
        border-bottom: solid 1px;
      }
    }

    :global(.editable-text){

      --caret-color: $colors.neutral-black;
      --outline-color: none;
      flex: 1;
      margin-right 15px;

      &:focus {
        border-bottom: 1px solid;
      }
    }

    :global(.editable-text[data-placeholder]) {
      &:before {
        color: $colors.neutral-black;
      }
    }
  }
</style>
