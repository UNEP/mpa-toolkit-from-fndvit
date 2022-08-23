import type { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { NodeName } from './schema';

export type FormattingError = {
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

class FormattingPlugin extends Plugin<{ decorations: DecorationSet; problems: FormattingError[] }> {
  rules: { [k in NodeName]?: NodeRule[] } = {};
  lastResult: FormattingError[];

  constructor() {
    super({
      state: {
        init: (_, { doc }) => this.runFormatting(doc),
        apply: (tr, old) => (tr.docChanged ? this.runFormatting(tr.doc) : old)
      },
      props: {
        decorations: state => this.getState(state).decorations
      }
    });
  }

  runFormatting(doc: Node) {
    const problems = this.checkFormatting(doc);
    const decos = problems.map(prob =>
      Decoration.inline(prob.from, prob.to, { class: 'problem', 'data-hover-msg': prob.rule.msg })
    );
    return { decorations: DecorationSet.create(doc, decos), problems };
  }

  checkFormatting(doc: Node) {
    const result: FormattingError[] = [];
    const record = (rule: NodeRule, from: number, to: number) => result.push({ rule, from, to });
    doc.descendants((node, pos) => {
      const rules = this.rules[node.type.name as NodeName];
      if (rules) {
        rules.filter(rule => rule.check(node)).forEach(rule => record(rule, pos, pos + node.nodeSize));
      }
    });
    this.lastResult = result;
    return result;
  }

  addNodeRule(nodeTypes: NodeName | NodeName[], level: ErrorLevel, msg: NodeRule['msg'], check: NodeRule['check']) {
    if (!Array.isArray(nodeTypes)) {
      this.addNodeRule([nodeTypes], level, msg, check);
    } else {
      nodeTypes.forEach(nodeType => {
        this.rules[nodeType] = this.rules[nodeType] ?? [];
        this.rules[nodeType].push({ nodeTypes, msg, level, check });
      });
    }
  }
}

export const formattingPlugin = new FormattingPlugin();

formattingPlugin.addNodeRule('heading', 'warning', 'Headings should not start with a space', node =>
  /^(\s+)/.exec(node.textContent) ? 'warning' : false
);

formattingPlugin.addNodeRule('paragraph', 'warning', 'Paragraphs should not start with a space', node =>
  /^(\s+)/.exec(node.textContent) ? 'warning' : false
);

formattingPlugin.addNodeRule('heading', 'error', 'Main sections need "read more" button text', node =>
  node.attrs.level === 1 && node.attrs.showmore?.length === 0 ? 'error' : false
);
