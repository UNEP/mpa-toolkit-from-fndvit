<script lang="ts">
  import ky from 'ky';
  import LoadingButton from '$lib/components/generic/LoadingButton.svelte';
  import { env } from '$env/dynamic/public';
  import { toaster } from '$lib/components/generic';

  let dump: { [key: string]: unknown[] };

  let fetching = false;
  let loading = false;
  let loaded = false;
  let files: FileList;

  function saveAs(filename: string, data: unknown) {
    const a = document.createElement('a');
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    a.style.display = 'none';
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async function onClickDump() {
    fetching = true;
    loaded = false;
    loading = false;
    try {
      const response = await ky(`/api/dump`);
      const _dump = await response.json();
      const ds = new Date().toISOString().replace(/:/g, '').replace(/\..+/, '');
      saveAs(`dump-${ds}.json`, _dump);
    } catch (err) {
      toaster.error('Failed to fetch');
      console.error(err);
    } finally {
      fetching = false;
    }
  }

  async function onClickRestore() {
    loading = true;
    try {
      await ky.post('/api/dump', { json: dump });
      loaded = true;
      toaster.done('Data restored successfully');
    } catch (error) {
      toaster.error('Error restoring db dump');
      console.error(error);
    } finally {
      loading = false;
    }
  }

  function checkFile(_dump: unknown) {
    if (!_dump || typeof _dump !== 'object') {
      toaster.error('Invalid dump file');
      return false;
    }

    const keys = Object.keys(_dump);
    if (keys.length === 0) {
      toaster.error('Empty dump');
      return false;
    }
    const required = ['pages', 'authors', 'tags'];
    for (const key of required) {
      if (!keys.includes(key)) {
        toaster.error(`Missing key ${key}`);
        return false;
      } else if (!Array.isArray(_dump[key])) {
        toaster.error(`Key ${key} is not an array`);
        return false;
      }
    }

    return true;
  }

  function onChangeInput() {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = e => {
      const _dump = JSON.parse(e.target.result as string);
      if (!checkFile(_dump)) {
        files = null;
        return;
      }
      dump = _dump;
    };
    reader.readAsText(file);
  }

  let inputEl: HTMLInputElement;
</script>

<div class="container">
  <div class="title">
    <a href="/cms">
      <span class="material-icons">navigate_before</span>
    </a>
    <h2>DB dump</h2>
  </div>

  <div class="controls">
    <LoadingButton on:click={onClickDump} loading={fetching}>Dump</LoadingButton>

    {#if env.PUBLIC_DB_RESTORE === 'true'}
      <LoadingButton on:click={() => inputEl.click()}>Open</LoadingButton>
      <input bind:this={inputEl} type="file" accept=".json" bind:files on:change={onChangeInput} />
    {/if}
  </div>
  {#if dump}
    <div class="fetched-data">
      <ul>
        <li>Authors: {dump.authors.length}</li>
        <li>Tags: {dump.tags.length}</li>
        <li>Pages: {dump.pages.length}</li>
      </ul>
    </div>
    <LoadingButton on:click={onClickRestore} {loading} disabled={loaded}>
      {!loaded ? 'Restore' : 'Restored'}
    </LoadingButton>
  {/if}
</div>

<style lang="stylus">

  .container {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    margin: 0px auto;
    width: fit-content;
    typography: ui;
    > .title {
      display: flex;
      align-items: center;
      column-gap: 20px;
      margin-bottom: 20px;
    }

    h2 {
      typography: h2-responsive;
      margin: 10px 0;
    }
  }
  .controls {
    display: flex;
    column-gap: 10px;
    > select {
      padding: 0 5px;
    }

    > input[type=file] {
      display: none;
    }
  }

  .fetched-data {
    margin-top: 20px;
    > ul {
      margin: 10px 0 20px;
      padding: 0;
      list-style: none;
      > li {
        margin: 5px 0;
      }
    }
  }

  .data-buttons {
    display: flex;
    column-gap: 10px;
  }


</style>
