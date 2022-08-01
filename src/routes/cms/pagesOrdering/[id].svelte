<script lang="ts">
  import type { SubTypes } from "$lib/types";
  import SortableList from 'svelte-sortable-list';
  import { updatePageOrdering } from "$lib/api";


  export let pageComponents: SubTypes.PageOrdering.PageComponents;
  export let id: number;

  let list = pageComponents.components.map(c => ({
    componentId: c.component.id,
    name: c.component.name,
    position: c.position,
  }));

  const sortList = ev => {list = ev.detail};

  const saveList = () => {
    const components = list.map((c, i)=> {
      return {
        componentId: c.componentId,
        position: i
      }
    });

    updatePageOrdering(id, {components});
  };
</script>

<div class="container">
  <button on:click={() => saveList()}>SAVE</button>
  <SortableList
    list={list}
    key="componentId"
    on:sort={sortList}
    let:item
  >
    <div class="item">
      <div class="name">{item.name}</div>
    </div>
  </SortableList>
</div>

<style lang="stylus">
  .container{
    cursor: pointer;
    width: 50%;
    margin: 0 auto;
    :global(ul){

    }
  }
  .item{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
  }
</style>