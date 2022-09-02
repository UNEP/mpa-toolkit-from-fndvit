<script lang="ts">

  import { slugify } from '$lib/utils';
  export let current: string = "Privacy policy";

  const options: string[] = ["Team", "Privacy policy", "Terms of use", "Partners", "Sitemap"];

</script>

<div class="container">
  {#each options as opt}
    <a class:selected={current === opt} href="/about/{slugify(opt)}">{opt}</a>
  {/each}
</div>

<style lang="stylus">

  .selected {
    color: #2A2A2A;
    background-color: rgba(255, 255, 255, 0.85);
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 20px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);

  }

  .selected:hover {
    background-color: rgba(255, 255, 255, 0.90);
  }

  .selected::after {
    height: 0px;
  }

  .container {
    display: flex;
    gap: 50px;
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

</style>