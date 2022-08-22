import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import type { Schema } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import type { DecorationSet } from 'prosemirror-view';
import { formattingPlugin } from './formatting';
import { buildInputRules } from './inputRules';
import { richTextKeyMapPlugin } from './keymap';
import { placeholderPlugin } from './placeholder';

export { dropCursor, gapCursor };

export const emptyPlugin = new Plugin<DecorationSet>({
  view: _view => {
    const update = view => {
      const isEmpty =
        view.state.doc.content.size === 0 || (view.state.doc.textContent === '' && view.state.doc.content.size < 3);

      view.dom.classList[isEmpty ? 'add' : 'remove']('ProseMirror-empty');
    };

    update(_view);
    return { update };
  }
});

export const plugins = (schema: Schema): Plugin[] => {
  return [
    history(),
    buildInputRules(schema),
    dropCursor(),
    gapCursor(),
    richTextKeyMapPlugin(schema),
    keymap(baseKeymap),
    emptyPlugin,
    placeholderPlugin,
    formattingPlugin
  ];
};
