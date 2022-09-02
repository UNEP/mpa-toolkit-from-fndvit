<script lang="ts">

  import { slugify } from '$lib/utils';
  export let current: string = "Privacy policy";

  const options: string[] = ["Team", "Privacy policy", "Terms of use", "Partners", "Sitemap"];
  let expanded = false;

  $: stroke = expanded ? "#2A2A2A" : "#FFFFFF";

  const onExpandButtonClicked = () => {
    expanded = !expanded;
  }

  const onCloseButtonClicked = () => {
    console.log("BLUR");
    expanded = !expanded;
  }

</script>

<div class="container">
  <div class="expand-button" on:click={onExpandButtonClicked}>
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <line x1="1" y1="1" x2="19" y2="1" {stroke} stroke-width="2" stroke-linecap="round"/>
      <line x1="1" y1="8" x2="19" y2="8" {stroke} stroke-width="2" stroke-linecap="round"/>
      <line x1="1" y1="15" x2="19" y2="15" {stroke} stroke-width="2" stroke-linecap="round"/>
    </svg>
  </div>
  <div class="options-container" class:expanded on:blur={onCloseButtonClicked}>
    {#each options as opt}
      <a on:click={onCloseButtonClicked} class:selected={current === opt} href="/about/{slugify(opt)}">{opt}</a>
    {/each}
  </div>
</div>

<style lang="stylus">

  .expand-button {
    display: none;
  }

  .selected {
    color: #2A2A2A;
    background-color: rgba(249, 249, 249, 0.85);
    border-radius: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

  }

  .selected:hover {
    background-color: rgba(249, 249, 249, 0.90);
  }

  .selected::after {
    height: 0px;
  }

  .options-container {
    display: flex;
    gap: 30px;
    justify-content: flex-end;
  }

  a {
    text-decoration: none;
    typography: ui-large-responsive;
    color: #ffffff;
    display: block;
    position: relative;
    padding: 0;
    overflow: hidden;
    padding-left: 20px;
    padding-right: 20px;
  }

  a::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #FFFFFF;
    transition: opacity 300ms, transform 300ms;
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  a:hover::after,
  a:focus::after {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

//--------------------MEDIUM---------------------------

  +breakpoint(page, medium) {

    .options-container {
      display: none;
    }

    .expand-button {
      display: flex;
      justify-content: flex-end;
    }

    .expanded {
      width: 50vw;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0px;
      right: 0px;
      background: #F9F9F9;
      box-shadow: -5px 0px 15px 1px rgba(0, 0, 0, 0.25);
      padding: 3rem;
      padding-left: 1.5rem;
      height: calc(100vh - 5rem);
      justify-content: flex-start;
      position: fixed;
      z-index: 10;
    }

    a {
      color: #2a2a2a
    }

    .selected {
      color: #2A2A2A;
      typography: h4;
      background-color: #F9F9F9;
      border-radius: none;
      box-shadow: none;
    }

  }

</style>