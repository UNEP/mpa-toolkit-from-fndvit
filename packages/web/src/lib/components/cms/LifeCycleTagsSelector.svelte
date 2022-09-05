<script lang="ts">
  import type { Tag } from '@mpa/db';
  import MultiSelect, { type Option } from 'svelte-multiselect';

  export let tags: Tag[];
  export let availableTags: Tag[];
  export let hideTagIds: Set<number> = undefined;
  export let max: number = undefined;

  type TagOption = Option & { tag: Tag };
  const tagToOption = (tag: Tag): TagOption => ({ value: tag.id, label: tag.value, tag });
  let selectedTagOptions = tags.map(tagToOption);

  $: filterFunc = (op: TagOption) => (hideTagIds ? !hideTagIds.has(op.tag.id) : true);
  $: availableTagOptions = availableTags.map(tagToOption);
  $: tags = selectedTagOptions.map(o => o.tag);
</script>

<MultiSelect bind:selected={selectedTagOptions} options={availableTagOptions} maxSelect={max} {filterFunc} />
