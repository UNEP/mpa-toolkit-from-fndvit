<script lang="ts">
  import Cards, { CardData } from "./Cards.svelte";

  export let cards: string[] = [];
  export let isTimerActive = true;
  export let editable = false;

  let bindData: CardData[];
  let currentCard = 0;

  const inFn = (_bindData: CardData[]) => cards = _bindData.map(c => c.body);
  const outFn = (_cards: string[]) => bindData = _cards.map(c => ({
    heading: null,
    body: c
  }));

  $: outFn(cards);
  $: inFn(bindData);

</script>

<Cards
  bind:cards={bindData}
  canToggleHeading={false}
  progress={isTimerActive}
  removable={false}
  style='no-heading'
  {editable}
  bind:currentPageIndex={currentCard}
/>
