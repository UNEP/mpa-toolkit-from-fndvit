<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import AuthorsEditor from "../cms/AuthorsEditor.svelte";
  import AuthorImage from "../AuthorImage.svelte";

  export let authors: SubTypes.Chapter.PageHead['authors'];
  export let editable = false;

  const emptyAuthors = [{ id: 0, name: 'Author', img: '' }];

  $: displayAuthors = editable && !authors.length ? emptyAuthors : authors;

</script>

<div class="author-images">
  {#each displayAuthors as author}
    <AuthorImage {author} />
  {/each}
</div>

  {#if editable}
    <div class="author-editor">
      <AuthorsEditor bind:authors={authors} />
    </div>
  {:else}
    <div class="author-names">
      {#each displayAuthors as author, i}
        {#if i > 0 && i === displayAuthors.length - 1}
          and
        {/if}
        <a href="/author/{author.id}" rel="external">{author.name}</a>
      {/each}
    </div>
  {/if}

<style lang="stylus">
  .author-images {
    height: 66px;
    margin-right: 15px;
    display: flex;
    column-gap: 10px;
  }

  .author-names {
    typography: h5;
    display: flex;
    align-items: center;
    column-gap: 5px;

    a {
      color: inherit;
      text-decoration: none;
    }
  }

  .author-editor {
    :global(.options) {
      color: #333;
    }
  }

</style>