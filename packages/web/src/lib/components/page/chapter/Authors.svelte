<script lang="ts">
  import type { Chapter } from '@mpa/db';
  import AuthorsEditor from './AuthorsEditor.svelte';
  import { slugify } from '$lib/utils';

  import AuthorImage from '$lib/components/cms/AuthorImage.svelte';
  export let authors: Chapter['authors'];
  export let editable = false;

  const emptyAuthors = [{ id: 0, name: 'Author', img: '' }];

  $: joinStrings = [
    // the join string to appear after the author name at each index
    ...Array.from({ length: Math.max(0, authors.length - 2) }, () => ', '),
    ...(authors.length >= 2 ? [' and '] : []),
    ''
  ];

  $: displayAuthors = editable && !authors.length ? emptyAuthors : authors;
</script>

<div class="author-images">
  {#each displayAuthors as author}
    <AuthorImage {author} />
  {/each}
</div>

{#if editable}
  <div class="author-editor">
    <AuthorsEditor bind:authors />
  </div>
{:else}
  <div class="author-names">
    {#each displayAuthors as author, i}
      <a href="/author/{slugify(author.name)}" rel="external">{author.name}</a>{joinStrings[i]}
      {#if i > 0 && i === displayAuthors.length - 1}
        <slot />
      {/if}
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
    display: inline;
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
