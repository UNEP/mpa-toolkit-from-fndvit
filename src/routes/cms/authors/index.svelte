<script lang="ts">

  import { createAuthor, deleteAuthor } from "$lib/api";
  import { getToaster } from "$lib/helpers/utils";
  import DeleteModal from "$lib/components/cms/DeleteModal.svelte";
  import { openModal } from "svelte-modals";
  import Searchbar from "$lib/components/generic/Searchbar.svelte";
  import type { SubTypes } from "$lib/types";
  import AuthorEditor from "$lib/components/cms/AuthorEditor.svelte";

  export let authors: SubTypes.Author.ForCMS[];

  let authorSearch = '';
  let newAuthor: SubTypes.Author.ForCMS;

  const toaster = getToaster();

  const sortAuthors = (_authors: typeof authors) => [..._authors].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'accent' })
  );

  authors = sortAuthors(authors);

  const handleDelete = async (author: SubTypes.Author.ForCMS) => {

    try {
      await deleteAuthor(author.id);
      toaster('Author deleted', {type: 'done'});
    }
    catch (err) {
      console.error(err);
      toaster(`Error deleting author: ${err.message}`, {type: 'error'});
    }
    authors = authors.filter(row => row != author);
  };

  const onClickAdd = () => newAuthor = { id: null, name: null, bio: null, img: null, chapter: [] };

  const onClickSaveAuthor = async () => {

    try {
      const _author = await createAuthor({ name: newAuthor.name, bio: newAuthor.bio });
      newAuthor.id = _author.id;

      authors.push({ ...newAuthor });
      authors = sortAuthors(authors);
      newAuthor = undefined;

      toaster('Author saved', { type: 'done' });
    }
    catch(e) {
      toaster('Error saving author', { type: 'error' });
    }
  };

  async function onClickDeleteAuthor(author: SubTypes.Author.ForCMS) {

    if (author.chapter.length === 0) {
      await handleDelete(author);
    }
    else {
      openModal(DeleteModal, {
        title: 'Delete Author',
        message:
          'This author is on some pages. Are you sure you want to delete it?',
        confirmText: author.name,
        onYes: () => handleDelete(author),
      });
    }
  };

  $: searchRegex = new RegExp(authorSearch, 'i');
  $: filteredAuthors = authors.filter(author => searchRegex.test(author.name));

</script>

<div class="container">

  <div class="title">
    <a href="/cms"><span class="material-icons arrow">navigate_before</span></a>
    <h1>Authors</h1>
  </div>

  <div class="tool-bar">
    <div class="searchbar">
      <Searchbar
        bind:search={authorSearch}
        type="inline"
        placeholder={"Search an Author..."}
        submit={null}
      />
    </div>

    <button class="add-author" on:click={onClickAdd}>
      <span class="material-icons face">face</span>New author
    </button>
  </div>

  {#if filteredAuthors.length === 0 && !newAuthor }
    <div class="no-authors">No authors</div>
  {:else}
    <ul class="authors">
      {#if newAuthor}
        <li>
          <AuthorEditor bind:author={newAuthor} />
          <button on:click|once={onClickSaveAuthor} class="icon-author">
            <div class="material-icons">done</div>
          </button>
        </li>
      {/if}
      {#each filteredAuthors as author (author.id)}
        <li>
          <AuthorEditor bind:author/>
          <button on:click|once={() => onClickDeleteAuthor(author)} class="icon-author">
            <div class="material-icons">delete</div>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="stylus">

  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 6rem;
  }

  .tool-bar {
    margin: 60px 0;
    display: flex;
    flex-wrap: wrap;
    row-gap: 10px;
    justify-content: space-between;
  }

  .searchbar {

    :global(.searchbar){
      width: 530px;
      :global(.placeholder){
        color: $colors.neutral-black;
      }
      :global(.input-text){
        color: $colors.neutral-black;
      }
    }
  }

  .add-author {
    display: flex;
    align-items: center;
    width: 252px;
    padding: 5px 20px;
    cursor: pointer;

    typography: h5-light;
    text-transform: uppercase;
    background: white;

    border: none;
    border-radius: 10px;
    box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;

    &:hover {
      background: $colors.neutral-light;
      text-decoration: none;
    }

    .face {
      padding: 10px;
    }
  }

  .no-authors {
    typography: ui;
  }

  .authors {
    padding: 0;
    > * {
      display: flex;
      border-bottom: solid 3px #F5F5F5;
    }

    .icon-author {
      border: none;
      background: none;
      margin-left: auto;
      margin-right: 0;
      cursor: pointer;

      &:hover {
        transform: scale(1.2);
      }
    }
  }

  h1 {
    typography: h2-responsive;
  }

  .title {
    display: flex;
    align-items: center;
    column-gap: 30px;

    .arrow {
     color: black;
     font-size: 32px;
    }
  }
</style>