import type { Schema } from "./schema";
import { EditorState, Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const placeholderPlugin = new Plugin<DecorationSet<Schema>>({
  state: {
    init() { return DecorationSet.empty; },
    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      const action = tr.getMeta(this);
      if (action && action.add) {
        const widget = document.createElement("placeholder");
        const deco = Decoration.widget(action.add.pos, widget, {id: action.add.id});
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(
          set.find(null, null, spec => spec.id == action.remove.id)
        );
      }
      return set;
    }
  },
  props: {
    decorations(state) { return this.getState(state); }
  }
});

export function findPlaceholder(state: EditorState, id) {
  const decos = placeholderPlugin.getState(state);
  const found = decos.find(null, null, spec => spec.id == id);
  return found.length ? found[0].from : null;
}