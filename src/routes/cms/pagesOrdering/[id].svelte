<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import SortableList from 'svelte-sortable-list';
  import { updatePageOrdering } from "$lib/api";
  import { getToaster } from '$lib/helpers/utils';
  import Spinner from "$lib/components/generic/Spinner.svelte";


  export let pageComponents: SubTypes.PageOrdering.PageComponents;
  export let id: number;

  const pageName = pageComponents.display;
  const toaster = getToaster();

  let saving = false;

  let list = pageComponents.components.map(c => ({
    componentId: c.component.id,
    name: c.component.name,
    position: c.position,
    icon: c.component.icon,
    display: c.component.display,
  }));

  const sortList = ev => {list = ev.detail};

  const saveList = async () => {
    saving = true;
    const components = list.map((c, i)=> {
      return {
        componentId: c.componentId,
        position: i
      }
    });

    try{
      await updatePageOrdering(id, {components});
      toaster('Page ordering updated', {type: 'done'});
    } catch(e) {
      toaster('Error saving page ordering', {type: 'error'});
      return;
    }

    saving = false;
  };
</script>
<div class="cms-pageordering">

    <h3>{pageName}</h3>

    <div class="grid-links">
      <SortableList
        list={list}
        key="componentId"
        on:sort={sortList}
        let:item
      >
        <div class="item">
          <span class="material-icons">{item.icon}</span>
          {item.display}
        </div>
      </SortableList>
    </div>
    <button on:click={saveList} disabled={saving}>
      <div style="{saving ? "display: none;" : ""}">
        Save
      </div>
      <div class="spinner p-responsive" class:saving>
        Saving...<Spinner/>
      </div>
    </button>
</div>

<style lang="stylus">

  .material-icons {
    font-size: 77px;
  }

 .cms-pageordering {

    button{
      height: 50px;
      width: 150px;
      text-align: center;
      typography: ui-large;
    }

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h3 {
      typography: h3-light-responsive;
      margin-bottom: 40px;
      text-align: center;
    }

    .item {
      typography: ui-small;
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  }

  .grid-links {
    display: flex;
    column-gap: 24px;
    row-gap: 24px;
    justify-content: center;

    :global(.item) {
      typography: ui-small;
      text-transform: uppercase;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background: white;
      border-radius: 24px;
      box-shadow: 0px 1px 16px rgba(0, 0, 0, 0.1);
      padding: 20px 10px 10px;
      width: 230px;
      box-sizing: border-box;

      &:hover {
        background: $colors.neutral-light;
        text-decoration: none;
      }
    }
  }

  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 15px;
    &:not(.saving) {
      visibility: hidden;
      display: none;
    }
  }

</style>