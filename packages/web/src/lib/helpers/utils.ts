import { writable } from 'svelte/store';

export const textOnlyPaste = (el: HTMLElement) => {
  el.addEventListener('paste', e => {
    const { clipboardData } = e;
    const paste = clipboardData?.getData('text').replace(/\n/g, ' ');
    if (paste) {
      document.execCommand('insertText', false, paste);
    }
    e.preventDefault();
  });
};

export const addFocusClass = (node: HTMLElement, cb: (focused: boolean) => void = () => null) => {
  const focus = () => {
    node.classList.add('focused');
    cb(true);
  };
  const blur = () => {
    node.classList.remove('focused');
    cb(false);
  };

  node.addEventListener('focus', focus);
  node.addEventListener('blur', blur);

  return {
    destroy() {
      node.removeEventListener('focus', focus);
      node.removeEventListener('blur', blur);
    }
  };
};

export function clickOutside(node: HTMLElement, fn: () => void) {
  const handleClick = (e: MouseEvent) => {
    if (!node.contains(e.target as Node)) {
      fn();
    }
  };

  document.addEventListener('click', handleClick, true);

  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
  };
}

export const timedBoolean = () => {
  let timeout: number;
  const value = writable(false);
  const obj = {
    value,
    start: (ms: number) => {
      value.set(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => value.set(false), ms);
    },
    stop: () => {
      value.set(false);
      window.clearTimeout(timeout);
    }
  };
  return obj;
};

export const imgLoadingStatus = (node: HTMLImageElement, cb: (loading: boolean) => void) => {
  node.addEventListener('load', () => cb(false));
  cb(!node.complete);
  new MutationObserver(() => cb(!node.complete)).observe(node, { attributes: true, attributeFilter: ['src'] });
};

export function insertInTextArea(text: string, el: HTMLInputElement) {
  const [start, end] = [el.selectionStart!, el.selectionEnd!];
  el.setRangeText(text, start, end, 'select');
  el.setSelectionRange(start + text.length, start + text.length);
}

export const onHoverEl = (node: HTMLElement, [className, cb]: [string, (el: HTMLElement) => void]) => {
  let problemEl: HTMLElement;
  node.addEventListener('mouseover', e => {
    const isProblemEl = e.target instanceof HTMLElement && e.target.className === className;
    if (isProblemEl) {
      problemEl = e.target;
      cb(problemEl);
    }
  });
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.removedNodes.forEach(n => {
        if (n === problemEl) {
          problemEl = null;
          cb(null);
        }
      });
    });
  });
  observer.observe(node, { childList: true, subtree: true });
};
