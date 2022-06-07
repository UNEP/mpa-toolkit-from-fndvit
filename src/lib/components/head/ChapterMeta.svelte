<script lang="ts">
  import type { SubTypes, UserInfo } from "$lib/types";
  import AuthorsEditor from "$lib/components/cms/AuthorsEditor.svelte";
  import KeyTakeaways from "$lib/components/cms/KeyTakeaways.svelte";
  import UserImage from "$lib/components/UserImage.svelte";
  import EditableText from "../generic/EditableText.svelte";

  export let chapter: SubTypes.Chapter.PageHead;
  export let allAuthors: UserInfo[] = [];
  export let editable = false;
  export let readTime: number = undefined;

  if (!chapter) {
    chapter = {
      authors: [],
      keyTakeaways: [],
      summary: ''
    };
  }

  const emptyAuthors = [{ id: 0, name: 'Author', img: '' }];

  function onClickAuthor(i: number) {
    chapter.authors = [...chapter.authors];
    chapter.authors.splice(i, 1);
  }

  $: displayAuthors = editable && !chapter.authors.length ? emptyAuthors : chapter.authors;

</script>

<div class="meta" class:meta-editable={editable}>

  <div class="first-line">

    <div class="author-images">
      {#each displayAuthors as user}
        <UserImage {user} />
      {/each}
    </div>

    {#if editable}

      <div class="author-editor">
        <AuthorsEditor {allAuthors} bind:authors={chapter.authors} />
      </div>
    {:else}
      <div class="author-names">
        {#each displayAuthors as author, i}
          {#if i > 0 && i === displayAuthors.length - 1}
            and
          {/if}
          <div on:click={() => editable && onClickAuthor(i)}>{author.name}</div>
        {/each}
      </div>
    {/if}

    {#if readTime !== undefined}
      <div class="readtime">{readTime} min read</div>
    {/if}

  </div>

  <div class="summary">
    <EditableText bind:value={chapter.summary} {editable} placeholder='Summary text...' />
  </div>

  <div class="key-takeaways">
    <KeyTakeaways bind:keyTakeaways={chapter.keyTakeaways} {editable} />
  </div>
</div>

<style lang="scss">

  .meta {
    --ui-color-placeholder: #ffffff55;
    background: #096EAE;
    color: #F9F9F9;
    padding: 2rem 124px;
  }

  .first-line {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    column-gap: 10px;
  }

  .author-images {
    height: 66px;
    margin-right: 15px;
    display: flex;
    column-gap: 10px;
  }

  .author-names {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    column-gap: 5px;
  }

  .summary {
    font-family: var(--font-serif);
    font-size: 28px;
    line-height: 42px;
    max-width: 800px;
    margin-bottom: 40px;
  }

  .author-editor {
    :global(.options) {
      color: #333;
    }
  }
  @media screen and (max-width: 1360px) {
    .key-takeaways {
      width: calc(680px);
    }
  }
  @media screen and (max-width: 1150px) {
    .key-takeaways {
      width: 100%;
    }
  }
  @media screen and (max-width: 768px) {

    .meta {
      padding-left: 20px;
      padding-right: 20px;
    }

    .author-images {
      max-width: 100%;
    }

    .first-line {
      display: block;
    }

    .author-names {
      margin-top: 20px;
    }

    .summary {
      font-size: 18px;
      line-height: 32px;
    }

  }


</style>