<script lang="ts" context="module">
  import { slugify } from '@mpa/utils';
  import MadLibSelector from './MadLibSelector.svelte';

  const tagValue = {
    'an MPA planner': 'MPA planners',
    'an MPA manager': 'MPA managers',
    'a community organizer': 'Community organizers',
    'an LMMA practitioner': 'LMMA practitioners',
    answers: 'Identifying solutions',
    examples: 'Exploring examples',
    'case studies': 'Comparing case studies',
    tools: 'Discovering tools',
    enable: 'Enabling decision-making',
    evaluate: 'Evaluating progress',
    'I need to make': 'Manager decision-making',
    'my team will make': 'Team decision-making',
    'my government needs to make': 'Government decision-making'
  };

  export function buildTagSlug(value: string[]) {
    return value
      .map(v => tagValue[v])
      .map(str => slugify(str))
      .join('+');
  }
</script>

<script lang="ts">
  const typeUserList = ['an MPA planner', 'an MPA manager', 'a community organizer', 'an LMMA practitioner'];
  const objectiveList = ['answers', 'examples', 'case studies', 'tools'];
  const objectiveVerbList = ['enable', 'evaluate'];
  const actionSubjectList = ['I need to make', 'my team will make', 'my government needs to make'];

  export let value: string[] = [null, null, null, null];
</script>

<p class="madlib">
  I am <MadLibSelector options={typeUserList} bind:selected={value[0]} /> and want help finding <MadLibSelector
    options={objectiveList}
    bind:selected={value[1]}
  /> to
  <MadLibSelector options={objectiveVerbList} bind:selected={value[2]} /> decisions
  <MadLibSelector options={actionSubjectList} bind:selected={value[3]} />
</p>

<style lang="stylus">

  .madlib {
    typography: h4-light-responsive;
    position: relative;

    :global(.content-madlib) & {
      typography: ui-large-responsive;
    }
  }

</style>
