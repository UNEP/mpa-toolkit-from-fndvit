<script lang="ts">
  import type { PageTag, Tag } from '@mpa/db';
  import { afterUpdate } from 'svelte';
  import MultiSelect, { type Option } from 'svelte-multiselect';
  import textFit from 'textfit';
  import { groupBy } from '@mpa/utils';
  import HelpPopup from './HelpPopup.svelte';
  import type { MenuElement } from '$lib/components/shared/CircleMenu.svelte';
  import { CircleMenu, TagContainer } from '$lib/components/shared';


  export let allTags: Tag[] = null;
  export let tags: PageTag[]; // binding (updated as tags are changed)
  export let editable = false;

  let currentTagHovered: number;
  let infoTextElement: HTMLElement;

  const helpText = '<b>What is the MPA lifecycle</b>';
  const fitTextOptions = {
    alignVert: true,
    alignHoriz: true,
    multiLine: true
  };
  const LIFECYCLE_CONFIG = [20, 20, 10, 5, 5, 10, 30]; // index matches tag id
  const LIFECYCLE_TEXT = [
    'Although there is no single recipe, there ways to optimize the <b>design</b> of your MPA based',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>',
    '<b>Where does this fit in the MPA management lifecycle?</b>'
  ]; // index matches tag id

  const MAX_PRIMARY_TAGS = 2;
  const MAX_SECONDARY_TAGS = 7;

  type PageTagOption = PageTag & Option;

  // used internally to bind to multiselect & keep track of selected tags
  const selectedTagOptions = groupBy(
    tags.map<PageTagOption>(t => ({ value: t.tag.id, label: t.tag.value, tag: t.tag, category: t.category })),
    t => (t.tag?.type === 'STAGE' ? t.category : t.tag.type)
  );

  const allPageTagOptions =
    editable && allTags.map<PageTagOption>(tag => ({ value: tag.id, label: tag.value, tag, category: 'PRIMARY' }));
  const groupedOptions = editable && groupBy(allPageTagOptions, ({ tag }) => tag.type);

  $: selectedStageTagIds = new Set([...tags.filter(({ tag }) => tag?.type === 'STAGE').map(({ tag }) => tag.id)]);

  $: availableStageOptions = editable && groupedOptions.STAGE.filter(({ tag }) => !selectedStageTagIds.has(tag.id));



  $: if (editable) {
    if(availableStageOptions.length <= 0){
      selectedTagOptions.PRIMARY = selectedTagOptions.PRIMARY.filter(o  => Object.hasOwn(o, 'tag'));
      selectedTagOptions.SECONDARY = selectedTagOptions.SECONDARY.filter(o  => Object.hasOwn(o, 'tag'));
    }
    tags = Object.values(selectedTagOptions)
      .flat()
      .map(o => ({ tag: o.tag, category: o.category }));
  }

  function sortAndGroupTags(_tags: typeof tags) {
    // sort primary tags to the top and sort by id so it's consistent
    const tagSortVal = (t: PageTag) => (t.category === 'PRIMARY' ? 0 : 100) + t.tag.id;
    const sortedTags = _tags.sort((a, b) => tagSortVal(a) - tagSortVal(b));
    return groupBy(sortedTags, t => t.tag.type);
  }

  $: renderTags = !editable && sortAndGroupTags(tags);

  $: menuData = LIFECYCLE_CONFIG.map<MenuElement>((percentage, i) => {
    const category = tags.find(({ tag }) => tag?.id === i)?.category;
    return {
      percentage,
      type: category === 'PRIMARY' ? 'main' : category === 'SECONDARY' ? 'secondary' : 'unselected'
    };
  });

  afterUpdate(() => {
    if (infoTextElement) textFit(infoTextElement, fitTextOptions);
  });
</script>

<div class="lifecycle">
  <div class="top-section">
    <h5 class="title">Where in the MPA lifecycle?</h5>
    <HelpPopup text={helpText}>
      <h3>What is the MPA lifecycle?</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Gravida laoreet leo scelerisque aliquet mattis
        malesuada turpis volutpat. Ultrices lectus suspendisse sed pharetra. Proin elementum lacus volutpat felis, nulla
        convallis aenean faucibus. Ante nisi, volutpat pretium diam porta eget. Egestas tempor, risus tortor malesuada.
        Mus et cras risus dictum. Quisque sollicitudin nisi, feugiat aenean.
      </p>
      <a href="/">More about this framework</a>
    </HelpPopup>
  </div>
  <div class="circle-menu-section">
    <div class="circle-menu">
      {#if currentTagHovered != null}
        <div class="info-text" bind:this={infoTextElement}>
          {@html LIFECYCLE_TEXT[currentTagHovered]}
        </div>
      {/if}
      <CircleMenu data={menuData} bind:currentSegmentHovered={currentTagHovered} />
    </div>

    <div class="tag-container">
      {#if editable}
        <div class="subtitle">Primary Tags</div>
        <MultiSelect
          bind:selected={selectedTagOptions.PRIMARY}
          options={availableStageOptions.length > 0 ? availableStageOptions : ['No options available']}
          maxSelect={MAX_PRIMARY_TAGS}
        />
        <div class="subtitle">Secondary Tags</div>
        <MultiSelect
          bind:selected={selectedTagOptions.SECONDARY}
          options={availableStageOptions.length > 0 ? availableStageOptions.map(o => ({ ...o, category: 'SECONDARY' })) : ['No options available']}
          maxSelect={MAX_SECONDARY_TAGS}
        />
      {:else}
        <TagContainer tags={renderTags.STAGE} bind:currentTagHovered />
      {/if}
    </div>
  </div>
  <div class="bottom-section">
    <h5 class="title">What&apos;s this about</h5>
    <div class="tag-container">
      {#if editable}
        <MultiSelect bind:selected={selectedTagOptions.TOPIC} options={groupedOptions.TOPIC} />
      {:else}
        <TagContainer tags={renderTags.TOPIC} />
      {/if}
    </div>
    <h5 class="title">Good for ...</h5>
    <div class="tag-container">
      {#if editable}
        <MultiSelect bind:selected={selectedTagOptions.USER} options={groupedOptions.USER} />
      {:else}
        <TagContainer tags={renderTags.USER} />
      {/if}
    </div>
  </div>
</div>

<style lang="stylus">

  .lifecycle {
    background: $colors.lifecycle-bg;
    color: black;
    box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    width: auto;
  }

  .top-section {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > :global(.help-popup) {
      flex-shrink: 0;
    }
  }

  .subtitle,
  .title {
    typography: h5-responsive;
  }

  .title {
    margin: 15px 0 10px;
    .top-section &:first-child {
      margin: 0;
    }
  }

  .tag-container :global(.multiselect) {
    --sms-border: 1px solid alpha(black, 0.1);
    --sms-border-radius: 0;
    --sms-padding: 0.1rem;
    box-shadow: inset 0px 2px 8px rgba(0, 0, 0, 0.05);
    typography: ui-small;

    :global(.selected > li[aria-selected]) {
      padding: 3px 12px;
      border-radius: 18px;
      background: $colors.highlight-1;
      line-height: 1em;
    }
    :global(.selected > li:last-child:not([aria-selected])) {
      display: none !important;
    }
  }

  .circle-menu-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    column-gap: 10px;

    .tag-container {
      flex: 1 1 70%;
    }

    .circle-menu {
      flex: 0.8 0.2 120px;
      position: relative;
      z-index: 1;

      :global(svg) {
        width: 100%;
      }

      .info-text {
        position: absolute;
        width: 45%;
        height: 45%;
        typography: ui-small;
        color: black;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: fadeIn ease-in-out 0.5s;
        -webkit-animation: fadeIn ease-in-out 0.5s;
        -moz-animation: fadeIn ease-in-out 0.5s;
        z-index: 0;
        color: #000000;
      }
    }
  }
  @media (max-width: 900px) {
    .title {
      width: auto;
    }
    .bottom-section {
      :global(.tag-container) {
        white-space: nowrap;
        overflow-x: scroll;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      :global(.tag-container::-webkit-scrollbar) {
        display: none;
      }
    }
  }

  :global(.multiselect .selected) {
    font-size: 10px;
  }

  @keyframes fadeIn {
    0% {
      opacity:0;
    }
    100% {
      opacity:1;
    }
  }
</style>
