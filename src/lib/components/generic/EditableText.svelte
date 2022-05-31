<script lang="ts">
  import { addFocusClass, textOnlyPaste } from "$lib/helpers/utils";

  export let editable = false;
  export let value: string;
  export let placeholder: string = null;
  export let focused: boolean = undefined;

  let el: HTMLElement;
  const handleContentEditableKeyPress: svelte.JSX.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  export const blur = () => el && el.blur();
  export const focus = () => el && el.focus();

</script>

{#if editable}
  <div class="editable-content editable-text"
    bind:this={el}
    use:addFocusClass={f => focused = f}
    use:textOnlyPaste
    on:keypress
    on:keydown
    on:keypress={handleContentEditableKeyPress}
    contenteditable data-placeholder={placeholder}
    bind:textContent={value} />
{:else}
  <div class="editable-content editable-text">{value || ''}</div>
{/if}

<style lang="scss">
  .editable-text {
    caret-color: var(--caret-color, white);
    color: inherit;
    background-color: inherit;


    &:focus {
      outline: none;
      background-color: var(--ui-color-focus);
    }

    &[data-placeholder] {
      &:before {
        content: attr(data-placeholder);
        color: var(--ui-color-placeholder, #ffffff44);
        pointer-events: none;
      }
      &:not(:empty):before {
        display: none !important;
      }
    }
  }

</style>