<script lang="ts">
  import { updateAuthor, uploadImage } from "$lib/api";
  import type { SubTypes } from "$lib/types";
  import { openModal } from "svelte-modals";
  import AuthorImage from "$lib/components/AuthorImage.svelte";
  import CropModal from "$lib/components/cms/CropModal.svelte";
  import Spinner from "$lib/components/generic/Spinner.svelte";

  export let author: SubTypes.Author.ForCMS;

  let inputEl: HTMLInputElement;
  let file: File;
  let saving = false;

  async function onCrop(file: File) {
    saving = true;
    const img = await uploadImage(file);
    await updateAuthor(author.id, { img });
    saving = false;
    author.img = img;
  }

  const onChangeFile: svelte.JSX.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const { files } = e.currentTarget;
    file = files[0];
    openModal(CropModal, { file, onCrop });
  };

</script>

<div class="editable-user-image">
  {#if saving}
  <div class="loading">
    <Spinner/>
  </div>
  {/if}
  <AuthorImage on:click={() => inputEl.click()} {author} />
  <input
    bind:this={inputEl}
    style="display: none;"
    type="file"
    on:change={onChangeFile}
    accept=".jpg,.png"
  />
</div>

<style lang="stylus">
  .editable-user-image {
    position: relative;
    font-size: 0;
  }
  .loading {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #22222266;
    border-radius: 50%;
  }

  :global(.user-image) {
    cursor: pointer;
    &:hover {
      filter: brightness(95%);
    }
  }
</style>