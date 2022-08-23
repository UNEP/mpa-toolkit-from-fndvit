<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import { formattingPlugin } from '$lib/editor/formatting';
  import Tooltip from '$lib/components/generic/Tooltip.svelte';

  export let editorState: EditorState;

  $: problems = formattingPlugin.getState(editorState).problems;

  const scrollToNextProblem = () => {
    const { el, top } = [...document.querySelectorAll('.problem')]
      .map(el => ({
        el,
        top: el.getBoundingClientRect().top
      }))
      .sort((a, b) => a.top - b.top)
      .find(({ top }) => top > window.innerHeight / 3);
    if (el) {
      window.scrollTo({
        top: 20 + top + window.scrollY - window.innerHeight / 3,
        behavior: `smooth`
      });
    }
  };
</script>

{#if problems?.length > 0}
  <div class="formatting-errors tooltip-hover-el" on:click={scrollToNextProblem}>
    <Tooltip text={`${problems.length} formatting errors`} />
    <span>warning</span>
    {problems.length}
  </div>
{/if}

<style lang="stylus">

  .formatting-errors {
    position: relative;
    cursor: pointer;
    typography: ui-small;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 0.4rem;
    padding: 0 10px;
    > span {
      font-family: "Material Icons";
      color: #900;
    }

    border: 1px solid transparent;
    &:hover {
      border: var(--ib-hover-border);
      border-radius: 3px;
    }
  }

</style>
