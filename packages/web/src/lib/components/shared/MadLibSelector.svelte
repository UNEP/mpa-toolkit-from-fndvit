<script lang="ts">
  import { scale } from 'svelte/transition';

  export let options: string[];
  export let selected = options[0];

  let currentIndex = 0;
  let listboxVisible = false;

  const chooseOption = (index: number) => {
    currentIndex = index;
    listboxVisible = false;
  };

  const handleKeyDown: svelte.JSX.KeyboardEventHandler<Window> = e => {
    if (listboxVisible) {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        currentIndex--;
        e.preventDefault();
      } else if (e.key === 'ArrowDown' && currentIndex < options.length - 1) {
        currentIndex++;
        e.preventDefault();
      }
    }
  };

  $: selected = options[currentIndex];
</script>

<svelte:window on:keydown={handleKeyDown} />

<span class="madlib-selector">
  <button
    class="selector-area"
    on:click={() => (listboxVisible = !listboxVisible)}
    on:blur={() => (listboxVisible = false)}
  >
    <svg class="arrow" viewBox="0 0 13 8">
      <path d="M0.630249 1L6.36134 6.5L12.0924 1" />
    </svg>

    {selected}
  </button>

  {#if listboxVisible}
    <ul class="listbox" transition:scale>
      {#each options as opt, i}
        <li
          class="option"
          class:selected={options[currentIndex] === opt}
          on:focus={() => chooseOption(i)}
          tabindex="-1"
        >
          {opt}
        </li>
      {/each}
    </ul>
  {/if}
</span>

<style lang="stylus">

  .madlib-selector {
    display: inline-block;
    border-radius: 20px;
    line-height: 100%;
    box-shadow: var(--madlib-selector-box-shadow, 0px 1px 8px 0px rgba(0, 0, 0, 0.2));
  }

  .option {
    display: block;
    border: none;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    cursor: pointer;
    border-radius: 10px;
    position: relative;

    &.selected,
    &:hover {
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.2);
      background-color: inherit;
    }

    &:hover {
      position: relative;
      z-index: 1;
    }

  }

  .selector-area {
    border: none;
    padding: 0.25rem 0.7rem 0.25rem 0.7rem;
    border-radius: inherit;
    cursor: pointer;
    background-blend-mode: soft-light;
    background: rgba(249, 249, 249, 0.08);
    color: inherit;

    &:focus {
      outline: 0.1rem solid;
    }

  }

  .listbox {
    margin-top: 0.5rem;
    position: absolute;
    display: block;
    box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.2);
    padding: 0.35rem 0.7rem 0.35rem 0.7rem;
    border-radius: 20px;
    background-color: $colors.neutral-bg;
    color: black;
    border: none;
    z-index: tooltip;
  }

  .arrow {
    transform: translateY(-0.1rem);
    width: 0.6em;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
  }

</style>
