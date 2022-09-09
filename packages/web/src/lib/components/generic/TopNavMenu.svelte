<script lang="ts">
  import { slugify } from '@mpa/utils';;
  export let current: string = "Privacy policy";

  const options: string[] = ["Partners", "Team", "Privacy policy", "Terms of use", "Sitemap"];

  let expanded = false;

  const toggleExpanded = () => expanded = !expanded;

</script>

<div class="container">
  {#if !expanded}
    <div class="expand-button" on:click={toggleExpanded}>
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
        <line x1="1" y1="1" x2="19" y2="1" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="8" x2="19" y2="8" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        <line x1="1" y1="15" x2="19" y2="15" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  {/if}

  <div class="options-container" class:expanded on:mouseleave={toggleExpanded}>
    {#each options as opt}
      <a tabindex="0" on:click={toggleExpanded} class:selected={current === opt} href="/{slugify(opt)}">{opt}</a>
    {/each}
    {#if expanded}
      <div class="close-button" on:click={toggleExpanded}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M8.9 7.5L14.7 1.7C15.1 1.3 15.1 0.7 14.7 0.3C14.3 -0.1 13.7 -0.1 13.3 0.3L7.5 6.1L1.7 0.3C1.3 -0.1 0.7
            -0.1 0.3 0.3C-0.1 0.7 -0.1 1.3 0.3 1.7L6.1 7.5L0.3 13.3C-0.1 13.7 -0.1 14.3 0.3 14.7C0.5 14.9 0.7 15 1 15C1.3 15 1.5 14.9 1.7 14.7L7.5
            8.9L13.3 14.7C13.5 14.9 13.8 15 14 15C14.2 15 14.5 14.9 14.7 14.7C15.1 14.3 15.1 13.7 14.7 13.3L8.9 7.5Z" fill="black"/>
        </svg>
      </div>
    {/if}
  </div>
</div>

<style lang="stylus">

  .close-button {
    display: none;
  }

  .expand-button {
    display: none;
  }

  .selected {
    text-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    box-shadow: 0px 0px 13px rgba(0, 0, 0, 0.05);
  }

  .selected:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }

  .selected::after {
    height: 0px;
  }

  .options-container {
    display: flex;
    gap: 30px;
    justify-content: flex-end;
    z-index: 2;
  }

  a {
    text-decoration: none;
    typography: ui-large-responsive;
    color: #ffffff;
    padding: 0;
    position: relative;
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

  +breakpoint(page, medium) {

    .options-container {
      display: none;
    }

    .expand-button {
      display: flex;
      justify-content: flex-end;
    }

    .close-button {
      display: block;
      position: absolute;
      top: 3.5rem;
      right: 3.5rem;
      z-index: 3;
      transform: scale(1.25, 1.25);
    }

    .expanded {
      width: 50vw;
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0px;
      right: 0px;
      background: $colors.neutral-bg;
      box-shadow: -5px 0px 15px 1px rgba(0, 0, 0, 0.25);
      padding: 3rem;
      padding-left: 1.5rem;
      height: calc(100vh - 5rem);
      justify-content: flex-start;
      position: fixed;
    }

    a {
      color: #2a2a2a
    }

    .selected {
      color: #2A2A2A;
      typography: h4;
      background-color: $colors.neutral-bg;
      border-radius: none;
      box-shadow: none;
      text-shadow: none;
    }

  }


  +breakpoint(page, small) {

    .close-button {
      top: 3rem;
      right: 3rem;
      transform: scale(1, 1);
    }

  }


</style>