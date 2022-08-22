import type { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { NodeName } from './schema';

const NODE_RULES: { [k in NodeName]?: NodeRule[] } = {};

addNodeRule('heading', 'warning', 'Headings should not start with a space', node =>
  /^(\s+)/.exec(node.textContent) ? 'warning' : false
);

addNodeRule('paragraph', 'warning', 'Paragraphs should not start with a space', node =>
  /^(\s+)/.exec(node.textContent) ? 'warning' : false
);

addNodeRule('heading', 'error', 'Main sections need "read more" button text', node =>
  node.attrs.level === 1 && node.attrs.showmore?.length === 0 ? 'error' : false
);

type FormattingError = {
  rule: NodeRule;
  from: number;
  to: number;
};

type ErrorLevel = 'error' | 'warning' | 'info';

type NodeRule = {
  nodeTypes: NodeName[];
  msg: string;
  level: ErrorLevel;
  check: (node: Node) => unknown;
};

function addNodeRule(
  nodeTypes: NodeName | NodeName[],
  level: ErrorLevel,
  msg: NodeRule['msg'],
  check: NodeRule['check']
) {
  if (!Array.isArray(nodeTypes)) {
    addNodeRule([nodeTypes], level, msg, check);
  } else {
    nodeTypes.forEach(nodeType => {
      NODE_RULES[nodeType] = NODE_RULES[nodeType] ?? [];
      NODE_RULES[nodeType].push({ nodeTypes, msg, level, check });
    });
  }
}

function formattingDeco(doc: Node) {
  const decos = checkFormatting(doc).map(prob =>
    Decoration.inline(prob.from, prob.to, { class: 'problem', 'data-problem-msg': prob.rule.msg })
  );
  return DecorationSet.create(doc, decos);
}

function checkFormatting(doc: Node) {
  const result: FormattingError[] = [];
  const record = (rule: NodeRule, from: number, to: number) => result.push({ rule, from, to });
  doc.descendants((node, pos) => {
    const rules = NODE_RULES[node.type.name as NodeName];
    if (rules) {
      rules.filter(rule => rule.check(node)).forEach(rule => record(rule, pos, pos + node.nodeSize));
    }
  });
  return result;
}

export const formattingPlugin = new Plugin({
  state: {
    init(_, { doc }) {
      return formattingDeco(doc);
    },
    apply(tr, old) {
      return tr.docChanged ? formattingDeco(tr.doc) : old;
    }
  },
  props: {
    decorations(state) {
      return this.getState(state);
    }
  }
});
