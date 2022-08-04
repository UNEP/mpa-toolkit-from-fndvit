<script lang="ts">
  import type { KeyLearningsData } from '$lib/types';
  import IconButton from '$lib/components/generic/IconButton.svelte';
  import EditableText from "../generic/EditableText.svelte";
  import KeyLearningsCards from './KeyLearningsCards.svelte';

  export let keyLearnings: KeyLearningsData[] = [];
  export let currentSubject = 0;
  export let editable = false;

  let focusSubjects: (() => void)[] = [];

  const onClickChangeSubject = (n: number) => currentSubject = n;

  const onClickAddKeyLearning = () => {
    let newKeyLearnings: KeyLearningsData = {subject: "", body: [""]};
    keyLearnings = [...keyLearnings, newKeyLearnings];
    const newIndex = keyLearnings.length - 1;
    onClickChangeSubject(newIndex);
    setTimeout(() => focusSubjects[newIndex](), 1);
  };

  const onClickRemoveKeyLearning = (i: number) => {
    if (keyLearnings.length > 1) {
      keyLearnings = keyLearnings.filter((_, j) => j !== i);
      if (i > 0) onClickChangeSubject(i - 1);
    }
  };

  if (keyLearnings.length === 0) {
    onClickAddKeyLearning();
  }

</script>

<div class="key-learnings">
  <div class="card">
    <div class="navigation-menu">
      <div class="titles-area">
        {#each keyLearnings as k, i}
          <div class="title" id={i.toString()} class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}>
            <EditableText bind:value={k.subject} {editable} placeholder='Key learning...' bind:focus={focusSubjects[i]} />
          </div>
        {/each}
        {#if editable}
          <div class="editor-button">
            <IconButton icon="add" on:click={() => onClickAddKeyLearning()} />
            <IconButton icon="delete" disabled={keyLearnings.length === 1}
              on:click={() => onClickRemoveKeyLearning(currentSubject)} />
          </div>
        {/if}
      </div>

      <div class="middle-area">
        <div class="vertical-dots">
          {#each keyLearnings as {}, i}
            <div class="circle" class:selected={i===currentSubject} on:click={() => onClickChangeSubject(i)}/>
          {/each}
        </div>
        <div class="line"/>
      </div>
    </div>

    {#each keyLearnings as k, i}
      <div class="card-content no-heading" class:card-content-active={currentSubject === i}>
        <KeyLearningsCards bind:cards={k.body} {editable} />
      </div>
    {/each}
  </div>
</div>

<style lang="stylus">

  .key-learnings {
    display: block;
    position: relative;
    width: 100%;
  }

  .editor-button {
    margin-top: 10px;
    right: 40px;
    display: flex;
    column-gap: 5px;
    justify-content: left;
    :global(.icon-button) {
      --ib-icon-bg: #00000022;
      --ib-hover-bg: #00000022;
      --ib-hover-border-color: #00000022;
      --ib-active-bg: #ffffff77;
    }
  }

  .middle-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    margin-left: 5px;
    margin-right: 10px;
  }

  .line {
    margin: auto;
    top: 0px;
    height: 100%;
    width: 1px;
    background-color: $colors.neutral-light;
  }

  .circle {
    height: 7px;
    width: 7px;
    background-color: black;
    border-radius: 100%;
    opacity: 0.25;
    cursor: pointer;
    z-index: 2;
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.15);

    &.selected {
      opacity: 1;
    }
  }

  .circle:hover {
    opacity: 0.5;
  }

  .vertical-dots {
    position: absolute;
    width: 10px;
    align-items: center;
    display: flex;
    flex-direction: column;
    row-gap: 7px;
    flex-grow: 0;
    margin: auto;
    background-color: $colors.neutral-bg;
    padding-bottom: 10px;
  }

  .navigation-menu {
    max-width: 220px;
    display: flex;
  }

  .titles-area {
    padding-left: 30px;
    padding-top: 35px;
    padding-bottom: 35px;
    width: 155px;
    typography: ui-small;
    color: black;
  }

  .title {
    cursor: pointer;
    opacity: 0.5;
    line-height: 22px;

    &.selected {
      opacity: 1;
      font-weight: bold;
    }

    :global(.editable-content) {
      margin-right: 2px;
    }
  }

  .card {
    display: flex;
    flex-direction: row;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.15);
    border-radius: 20px;
    background-color: $colors.neutral-bg;

    :global(.editable-text) {
      --outline-color: #d1d1d1;
      --caret-color: $colors.neutral-black;
    }
  }

  .card-content {
    min-width: 0;
    flex: 1;
    &:not(.card-content-active) {
      display: none;
    }
    :global(.editable-content[contenteditable]) {
      margin: 2px;
    }

    :global(.cards) {
      height: 100%;
    }
    :global(.splide) {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    :global(.splide__track) {
      flex: 1;
    }
    :global(.cards .editor-buttons) {
      bottom: 20px;
    }

  }


  +breakpoint(page, medium) {

    .navigation-menu {
      flex-direction: column;
      max-width: none;
    }

    .titles-area {
      display: flex;
      flex-direction: row;
      width: auto;
      column-gap: 15px;
      padding: 20px 0px 10px 0px;
      flex-wrap: nowrap;
      overflow-x: scroll;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      border-left: 30px solid $colors.neutral-bg;
      border-right: 30px solid $colors.neutral-bg;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .middle-area {
      flex-direction: row;
      padding: 15px 0px 0px 0px;
      margin-right: 0px;
    }

    .vertical-dots {
      height: 10px;
      width: auto;
      flex-direction: row;
      column-gap: 7px;
      padding-left: 25px;
      padding-right: 10px;
      z-index: 10;
    }

    .title {
      white-space: nowrap;
    }

    .card {
      flex-direction: column;
      background-color: $colors.neutral-bg;
    }

    .line {
      margin: auto;
      height: 1px;
      width: 100%;
      transform: translateY(-5px);
    }

  }

</style>
