import { EditorState, Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export const placeholderPlugin = new Plugin<DecorationSet>({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      const action = tr.getMeta(this);
      if (action && action.add) {
        const widget = document.createElement('placeholder');
        const deco = Decoration.widget(action.add.pos, widget, { key: action.add.key });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(set.find(null, null, spec => spec.key == action.remove.key));
      }
      return set;
    }
  },
  props: {
    decorations(state) {
      return this.getState(state);
    }
  }
});

export function findPlaceholder(state: EditorState, key) {
  const decos = placeholderPlugin.getState(state);
  const found = decos.find(null, null, spec => spec.key == key);
  return found.length ? found[0].from : null;
}
