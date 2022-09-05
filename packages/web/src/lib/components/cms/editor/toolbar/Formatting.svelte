<script lang="ts">
  import type { EditorState } from 'prosemirror-state';
  import { groupBy } from '@mpa/utils';
  import { formattingPlugin, type FormattingError } from '$lib/editor/formatting';
  import Tooltip from '$lib/components/generic/Tooltip.svelte';

  export let editorState: EditorState;

  $: problems = formattingPlugin.getState(editorState).problems;

  $: groupedProblems = groupBy(problems, p => p.rule.type);

  const scrollToNextProblem = (type: FormattingError['rule']['type']) => {
    const allEls = [...document.querySelectorAll(`.problem[data-problem-type="${type}"]`)]
      .map(el => ({
        el,
        top: el.getBoundingClientRect().top
      }))
      .sort((a, b) => a.top - b.top);

    const { el, top } = allEls.find(({ top }) => top > window.innerHeight / 3) || allEls[0];

    if (el) {
      window.scrollTo({
        top: 20 + top + window.scrollY - window.innerHeight / 3,
        behavior: `smooth`
      });
    }
  };
</script>

{#if groupedProblems.todo?.length > 0}
  <div class="formatting-notifications tooltip-hover-el" on:click={() => scrollToNextProblem('todo')}>
    <Tooltip text={`${groupedProblems.todo.length} todos`} />
    <span class="format-todo-icon">notifications</span>
    {groupedProblems.todo.length}
  </div>
{/if}

{#if groupedProblems.error?.length > 0}
  <div class="formatting-notifications tooltip-hover-el" on:click={() => scrollToNextProblem('error')}>
    <Tooltip text={`${groupedProblems.error.length} formatting errors`} />
    <span>warning</span>
    {groupedProblems.error.length}
  </div>
{/if}

<style lang="stylus">

  .formatting-notifications {
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
      color: #933;
      font-size: 14px;
    }

    > .format-todo-icon {
      color: #449;
      font-size: 14px;
    }

    border: 1px solid transparent;
    &:hover {
      border: var(--ib-hover-border);
      border-radius: 3px;
    }
  }

</style>
