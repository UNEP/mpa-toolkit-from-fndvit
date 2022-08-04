<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let active = false;
  export let progress = false;

  const dispatch = createEventDispatcher<{progressAnimationFinished: null}>();

</script>

<div class="dot" class:active class:progress on:click>
  <div class="dot-progressbar" on:animationend={() => dispatch('progressAnimationFinished')} />
  <div class="dot-background" />
</div>

<style lang="stylus">

  $defaults = {
    color: black,
    size: 7px,
    progress-duration: 10s,
    fade: 0.25
  };

  .dot {
    position: relative;
    border-radius: var(--dot-size, $defaults.size);
    overflow: hidden;
    transition: opacity 100ms ease, height 100ms ease, flex 100ms ease;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    flex: 0 0 var(--dot-size, $defaults.size);
    height: var(--dot-size, $defaults.size);

    @keyframes dot-progressbar-animation {
      from { width: 0; }
      to { width: 100%; }
    }


    &.progress.active {
      flex: 0 1 200px;
      cursor: default;
      .dot-progressbar {
        animation: var(--dot-progress-duration, $defaults.progress-duration) dot-progressbar-animation 0s linear;
      }
    }

  }

  .dot-progressbar {
    position: absolute;
    background-color: var(--dot-color, $defaults.color);
    height: var(--dot-size, $defaults.size);
    .dot:not(.progress.active) & {
      display: none;
    };
  }

  .dot-background {
    background-color: var(--dot-color, $defaults.color);
    opacity: var(--dot-fade, $defaults.fade);
    width: 100%;
    height: 100%;
    .dot.active:not(.progress) & {
      opacity: 1;
    }
    .dot:hover:not(.active) & {
      opacity: 0.5;
    }
  }
</style>
