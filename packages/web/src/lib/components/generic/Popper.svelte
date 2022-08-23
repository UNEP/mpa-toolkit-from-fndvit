<script lang="ts">
  import { createPopper, type Instance as PopperInstance } from '@popperjs/core';

  export let hoverEl: HTMLElement = null;

  export const load = (el: HTMLElement) => update(el);

  let popper: { instance: PopperInstance; destroy: () => void } = null;
  let message: string;

  let tooltipEl: HTMLDivElement;

  function update(el: HTMLElement) {
    if (popper) {
      popper && popper.destroy();
      popper = null;
    }

    if (el) {
      message = el.dataset.hoverMsg;
      const instance = createPopper(el, tooltipEl, {
        placement: 'auto',
        onFirstUpdate: () => (tooltipEl.style.visibility = 'visible'),
        modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
      });
      const destroy = () => {
        tooltipEl.style.visibility = 'hidden';
        instance.destroy();
      };
      el.addEventListener('mouseleave', destroy);
      popper = { instance, destroy };
    }
  }

  $: update(hoverEl);
</script>

<div class="tooltip" bind:this={tooltipEl} role="tooltip">
  {message}
  <div class="arrow" data-popper-arrow />
</div>

<style lang="stylus">

  .tooltip {
    typography: ui;
    background: white;
    color: #333;
    padding: 10px 15px;
    border-radius: 4px;
    z-index: $z-index.tooltip;
    visibility: hidden;
    position: absolute;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    max-width: 200px;
    text-align: center;

    .arrow,
    .arrow::before {
      position: absolute;
      width: 8px;
      height: 8px;
      background: inherit;
    }

    .arrow {
      visibility: hidden;
    }

    .arrow::before {
      visibility: visible;
      content: '';
      transform: rotate(45deg);
    }
    &:global([data-popper-placement^='top']) > .arrow {
      bottom: -4px;
      &:before {
        box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      }
    }

    &:global([data-popper-placement^='bottom']) > .arrow {
      top: -4px;
      &:before {
        box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
      }
    }

    &:global([data-popper-placement^='left']) > .arrow {
      right: -4px;
      &:before {
        box-shadow: 1px -1px 2px rgba(0, 0, 0, 0.1);
      }
    }

    &:global([data-popper-placement^='right']) > .arrow {
      left: -4px;
      &:before {
        box-shadow: -1px 1px 2px rgba(0, 0, 0, 0.1);
      }
    }
  }

</style>
