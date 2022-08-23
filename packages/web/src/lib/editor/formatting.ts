import type { Node } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import type { NodeName } from './schema';
import { findAllMatches } from '$lib/helpers/utils';

export type FormattingError = {
  rule: NodeRule;
  from: number;
  to: number;
};

type NodeRule = {
  blocks: NodeName[];
  name: string;
  msg: string;
  inline?: boolean;
  check: (node: Node, parent: Node) => { from: number; to: number }[] | boolean;
};

class FormattingPlugin extends Plugin<{ decorations: DecorationSet; problems: FormattingError[] }> {
  rules: { [k in NodeName]?: NodeRule[] } = {};
  lastResult: FormattingError[];

  constructor(options: { rules: { [key: string]: Omit<NodeRule, 'name'> } }) {
    super({
      state: {
        init: (_, { doc }) => this.runFormatting(doc),
        apply: (tr, old) => (tr.docChanged ? this.runFormatting(tr.doc) : old)
      },
      props: {
        decorations: state => this.getState(state).decorations
      }
    });
    Object.entries(options.rules).forEach(([name, rule]) =>
      this.addNodeRule(name, rule.blocks, rule.inline, rule.msg, rule.check)
    );
  }

  runFormatting(doc: Node) {
    const problems = this.checkFormatting(doc);
    const decos = problems.map(prob =>
      Decoration.inline(prob.from, prob.to, {
        class: 'problem',
        'data-hover-msg': prob.rule.msg,
        'data-problem-name': prob.rule.name
      })
    );
    return { decorations: DecorationSet.create(doc, decos), problems };
  }

  checkFormatting(doc: Node) {
    const result: FormattingError[] = [];
    const record = (rule: NodeRule, from: number, to: number) => result.push({ rule, from, to });
    doc.descendants((node, pos, parent) => {
      const rules = this.rules[(node.isInline ? parent : node).type.name as NodeName] || [];
      rules
        .filter(rule => (rule.inline || false) === node.isInline)
        .forEach(rule => {
          const r = rule.check(node, parent);
          if (r === true) {
            record(rule, pos, pos + node.nodeSize);
          } else if (r instanceof Array) {
            r.forEach(({ from, to }) => record(rule, pos + from, pos + to));
          }
        });
    });
    this.lastResult = result;
    return result;
  }

  addNodeRule(
    name: string,
    blocks: NodeName | NodeName[],
    inline: boolean,
    msg: NodeRule['msg'],
    check: NodeRule['check']
  ) {
    if (!Array.isArray(blocks)) {
      this.addNodeRule(name, [blocks], inline, msg, check);
    } else {
      blocks.forEach(nodeType => {
        this.rules[nodeType] = this.rules[nodeType] ?? [];
        this.rules[nodeType].push({ name, blocks, msg, inline, check });
      });
    }
  }
}

export const formattingPlugin = new FormattingPlugin({
  rules: {
    'leading-space': {
      blocks: ['paragraph', 'heading'],
      msg: 'Blocks should not start with a space',
      check: node => {
        const m = /^\s+/.exec(node.textContent);
        if (/Behavioural changes/g.exec(node.textContent)) console.log(m, node.textContent);
        return m ? [{ from: 0, to: m[0].length + 1 }] : false;
      }
    },
    'heading-readmore': {
      blocks: ['heading'],
      msg: 'Main sections need "read more" button text',
      check: node => (node.attrs.level === 1 && node.attrs.showmore?.length === 0 ? true : false)
    },
    'custom-bullets': {
      blocks: ['paragraph'],
      msg: 'Use built-in bullet points',
      check: node => {
        const m = /^ *● */.exec(node.textContent);
        return m ? [{ from: 0, to: m[0].length + 1 }] : false;
      }
    },
    'double-space': {
      blocks: ['paragraph', 'heading'],
      inline: true,
      msg: 'Multiple spaces',
      check: (node, parent) => {
        const matches = findAllMatches(node.textContent, /\s\s+/g);
        // pop first match if it's at the start of a block (handled by leading-space rule)
        if (matches[0]?.index === 0 && parent.child(0) === node) matches.shift();
        return matches ? matches.map(m => ({ from: m.index, to: m.index + m[0].length })) : false;
      }
    }
  }
});
