<script lang="ts">
  import { createPopper, type Instance as PopperInstance, type Placement } from '@popperjs/core';

  export const load = (el: HTMLElement) => update(el);

  let tooltip: { popper: PopperInstance; el: HTMLElement; observer: MutationObserver } = null;
  let message: string;

  let tooltipEl: HTMLDivElement;

  const destroy = () => {
    tooltipEl.style.visibility = 'hidden';
    if (tooltip) {
      tooltip.popper.destroy();
      tooltip.observer.disconnect();
      tooltip = null;
    }
  };

  function update(el: HTMLElement) {
    if (tooltip?.el === el) return;
    if (tooltip) destroy();

    if (el) {
      message = el.dataset.hoverMsg;
      const targetSelector = el.getAttribute('data-tooltip-target');
      const target = targetSelector ? document.querySelector(targetSelector) : el;

      tooltip = {
        popper: createPopper(target, tooltipEl, {
          placement: (el.getAttribute('data-tooltip-placement') as Placement) || 'auto',
          onFirstUpdate: () => (tooltipEl.style.visibility = 'visible'),
          modifiers: [{ name: 'offset', options: { offset: [0, 12] } }]
        }),
        el,
        observer: new MutationObserver(() => {
          if (!document.body.contains(tooltip.el)) destroy();
        })
      };
      tooltip.observer.observe(tooltip.el.parentElement, { childList: true });
      el.addEventListener('mouseleave', destroy);
    }
  }
</script>

<div class="tooltip" bind:this={tooltipEl} role="tooltip">
  {message}
  <div class="arrow" data-popper-arrow />
</div>

<style lang="postcss">
  :global(.tooltip[data-popper-placement^='top']) > .arrow {
  bottom: -4px;
}

:global(.tooltip[data-popper-placement^='bottom']) > .arrow {
  top: -4px;
}

:global(.tooltip[data-popper-placement^='left']) > .arrow {
  right: -4px;
}

:global(.tooltip[data-popper-placement^='right']) > .arrow {
  left: -4px;
}
  .tooltip {
    pointer-events: none;
    font: $f-ui;
    background: white;
    color: #333;
    padding: 10px 15px;
    border-radius: 4px;
    z-index: $z-tooltip;
    visibility: hidden;
    position: absolute;
    max-width: 200px;
    text-align: center;
    filter: drop-shadow(0 0 5px rgb(0 0 0 / 20%));

    .arrow {
      position: absolute;
    }

    .arrow::before {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      background: white;
      transform: rotate(45deg);
    }
  }
</style>
