<script lang="ts">
  import type { PageRequest, SubTypes, Tag, Author } from '$lib/types';
  import type Toaster from '$lib/components/generic/Toaster.svelte';
  import LifeCycle from '$lib/components/LifeCycle.svelte';
  import { openModal } from 'svelte-modals';
  import { goto } from "$app/navigation";
  import Editor from "$lib/components/cms/editor/Editor.svelte";
  import Spinner from "$lib/components/generic/Spinner.svelte";
  import DeleteModal from "$lib/components/cms/DeleteModal.svelte";
  import { createPage, deletePage, updatePage, uploadImage } from '$lib/api';
  import LoadingButton from '$lib/components/generic/LoadingButton.svelte';
  import Button from '$lib/components/generic/Button.svelte';
  import CaseStudyHead from '$lib/components/head/CaseStudyHead.svelte';
  import ChapterHead from '$lib/components/head/ChapterHead.svelte';
  import PageSplash from '$lib/components/head/PageSplash.svelte';
  import clone from 'clone';
  import { compareDeep, createLookup, insertInTextArea, slugify, Unpacked } from '$lib/helpers/utils';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import PageContent from '$lib/components/content/PageContent.svelte';
  import { getContext, setContext } from 'svelte';
  import { getPageTypeStr } from '$lib/helpers/content';
  import { page as pageStore } from '$app/stores';

  export let authors: SubTypes.Author[];
  export let allTags: Tag[];
  export let page: SubTypes.Page.Full;

  setContext('allAuthors', authors);

  const { protocol, hostname, port } = $pageStore.url;
  const URL_PREFIX = `${protocol}//${hostname}${port ? `:${port}` : ''}/`;

  const authorLookup = createLookup(authors, a => a.id.toString(), u => u);
  const tagLookup = createLookup(allTags, t => t.id.toString(), t => t);

  const pageId = page.id;
  const isNewPage = !page.id;

  let pageType: "Case Study" | "Chapter" = page.caseStudy ? "Case Study" : "Chapter";

  const pageTagToRequestTag = (t: SubTypes.PageTag): Unpacked<PageRequest['tags']> => ({id: t.tag.id, category: t.category});
  const chapterToRequest = (c: SubTypes.Chapter.PageHead): PageRequest['chapter'] => ({
    ...c, authors: c.authors.map(a => a.id),
  });

  const convertPageToPageRequest = (p: SubTypes.Page.Full): PageRequest => {
    const _p = clone(p);
    return {
      ..._p,
      tags: _p.tags?.map(pageTagToRequestTag) || [],
      chapter: _p.chapter ? chapterToRequest(_p.chapter) : undefined,
      caseStudy: _p.caseStudy ? _p.caseStudy : undefined
    };
  };

  let _page = convertPageToPageRequest(page);

  let chapter = clone(page.chapter);
  let tags: SubTypes.PageTag[] = page.tags || [];

  let savedPage = clone(_page);
  let uploadingImage = false;
  let saving = false;
  let deleting = false;
  let autoPopulateSlug = !_page.slug;
  let imageInput: HTMLInputElement;
  let preview = false;

  const addToastMessage = getContext<Toaster['$$prop_def']['addMessage']>('addToastMessage');

  async function onClickSave() {
    saving = true;

    if (isNewPage) {
      const {id} = await createPage(_page);
      window.location.href = `/cms/pages/${id}`;
    } else {
      await updatePage(pageId, _page);
    }
    saving = false;
    addToastMessage('Saved', {type: 'done'});
    savedPage = clone(_page);
  }

  async function onDeleteModalYes() {
    deleting = true;
    const success = await deletePage(pageId);
    if (!success) addToastMessage('Delete failed', {type: 'error'});
    else goto('/cms/pages');
  }

  async function onClickDelete() {
    openModal(DeleteModal, {
      onYes: onDeleteModalYes,
      title: 'Delete page',
      message: 'Are you sure you want to delete this page?'
    });
  }

  const onImageChange: svelte.JSX.EventHandler<FormDataEvent, HTMLInputElement> = async (e) => {
    if (e.currentTarget.files.length) {
      uploadingImage = true;
      _page.img = await uploadImage(e.currentTarget.files[0]);
      uploadingImage = false;
    }
  };

  const onChangeSlug: svelte.JSX.ChangeEventHandler<HTMLInputElement> = e => {
    autoPopulateSlug = e.currentTarget.value.length === 0;
  };

  const onBeforeInputSlug: svelte.JSX.EventHandler<InputEvent, HTMLInputElement> = e => {
    const validChars = /[a-zA-Z0-9-]/;
    if (e.data === ' ') {
      e.preventDefault();
      insertInTextArea('-', e.target as HTMLInputElement);
    }
    else if (!validChars.exec(e.data)) return e.preventDefault();
    else autoPopulateSlug = false;
  };

  $: _page.tags = tags.map(pageTagToRequestTag);

  $: dirty = !compareDeep(_page, savedPage);

  $: if (autoPopulateSlug) {
    _page.slug = pageType === 'Case Study' ? slugify(_page.caseStudy.name) : slugify(_page.title);
  }

  $: sharedFieldsComplete = !!(_page.title && _page.slug);

  $: disabled = saving || deleting;

  $: saveable = dirty && !saving && !deleting && sharedFieldsComplete;

  $: _page.chapter = chapter ? chapterToRequest(chapter) : undefined;

  let previewPage: SubTypes.Page.Full;
  $: previewPage = preview && {
    ..._page,
    id: null,
    readTime: null,
    tags: _page.tags.map<SubTypes.PageTag>(t => ({
      tag: tagLookup[t.id],
      category: t.category
    })),
    chapter: !_page.chapter ? undefined : {
      ..._page.chapter,
      authors: _page.chapter.authors.map<Author>(a => authorLookup[a.toString()]),
    }
  };

  $: href = `${_page.draft ? '/draft' : ''}/${savedPage.slug}`;

</script>

<div class="page page-editor" class:preview class:is-new-page={isNewPage} data-pagetype={getPageTypeStr(page)} >
  <div class="meta">

    <div class="top-controls">
      <input class="image-input" bind:this={imageInput} type="file" on:change={onImageChange} accept=".jpg, .jpeg" {disabled} >

      <div class="slug">
        <span class="url-prefix">{URL_PREFIX}</span>
        <input type="text" id="slug" bind:value={_page.slug} {disabled}
          on:beforeinput={onBeforeInputSlug}
          on:change={onChangeSlug}
        />
      </div>

      <IconButton icon="image" {disabled} on:click={() => imageInput.click()} />
      <div class="spinner" class:hidden={!uploadingImage}>
        <Spinner />
      </div>

    </div>

    <PageSplash bind:page={_page} editable={!preview} />
    {#if pageType === "Case Study"}
      <CaseStudyHead bind:caseStudy={_page.caseStudy} editable={!preview} tags={page.tags} />
    {:else}
      <ChapterHead bind:chapter editable={!preview} tags={page.tags} />
    {/if}

  </div>

  <div class="editor-container">

    <div class="life-cycle-editor">
      <LifeCycle {allTags} bind:tags editable/>
    </div>

    <Editor bind:content={_page.content}>
      <div slot="menu-extra" class="page-controls">
        {#if saving}Saving...{/if}
        <IconButton {href} rel="external" target="_blank" icon="open_in_new" title="Open link in new page" />
        <div class="draft-button">
          <IconButton on:click={() => _page.draft = !_page.draft} title={_page.draft ? "Click to publish" : "Click to make draft"}
            icon={_page.draft ? 'article' : 'public'}
            text={_page.draft ? 'Draft' : 'Live'}
          />
        </div>
        <Button on:click={() => preview = !preview}>{preview ? 'Close preview' : 'Preview'}</Button>
        <div class="save-button">
          <LoadingButton on:click={onClickSave} loading={saving} disabled={!saveable}>
            {dirty ? 'Save' : 'Saved'}
          </LoadingButton>
        </div>
        {#if !isNewPage}
          <div class="delete-button">
            <Button on:click={onClickDelete}>Delete</Button>
          </div>
        {/if}
      </div>
    </Editor>

    {#if preview}
      <PageContent page={previewPage} />
    {/if}
  </div>
</div>

<style lang="stylus">

  .draft-button {
    :global(.icon-button) {
      column-gap: 0;
    }
  }

  .top-controls {
    position: absolute;
    left: 0;
    right: 0;
    width: fit-content;
    margin: auto;
    padding-top: 40px;
    display: flex;
    column-gap: 10px;
    align-items: center;
    :global(.icon-button) {
      --bg-color: #ffffff99;
      --ib-hover-border-color: transparent;
      --ib-hover-bg: #dddddd99;
      --ib-font-size: 1rem;
    }

    .spinner {
      display: flex;
      align-items: center;
      &.hidden {
        visibility: hidden;
      }
    }
  }

  .slug {
    typography: ui;
    width: 550px;
    background: #ffffff99;
    border: 1px solid #00000055;
    border-radius: 2px;
    height: 32px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .url-prefix {
      margin-left: 2px;
      opacity: 0.5;
      margin-right: -2px;
    }
    input {
      border: none;
      border-radius: 0;
      background: transparent;
      flex: 1;
      margin-bottom: 1px;
      text-transform: lowercase;
    }
  }

  .image-input {
    display: none;
  }

  .page-controls {
    display: flex;
    column-gap: 10px;
    align-items: center;
    :global(.message) {
      margin-right: 10px;
      color: #999;
    }
    @keyframes bgPulse {
      0% { border-color: #bbb;  }
      100% { border-color: #999;
        box-shadow: inset #a0b6e455 0 0 15px 0px, #c5cddf 0 0 2px 1px;
      }
    }
    .save-button :global(.button:not(:disabled)) {
      animation: 1s ease-in 0s infinite alternate bgPulse;
    }
    .is-new-page & :global(.icon-button[data-icon="open_in_new"]) {
      display: none;
    }
  }

  .page-editor {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    :global(.prosemirror-container) {
      flex: 1;
    }
  }

  .life-cycle-editor {
    position: absolute;
    z-index: 1;
    right: 10px;
    margin-top: 60px;
    max-width: 350px;
  }

  .preview {

    padding-top: 51px;

    :global(.menu-bar) {
      position: fixed;
    }

    .top-controls,
    .life-cycle-editor,
    :global(.editor-content),
    :global(.menu-bar .left-section),
    .draft-button {
      display: none;
    }
  }

</style>