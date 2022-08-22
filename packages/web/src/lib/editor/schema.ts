import { Schema as ProsemirrorSchema } from 'prosemirror-model';
import { svelteSchemaNode } from 'prosemirror-svelte-nodeview';

export const simpleSchema = new ProsemirrorSchema({
  nodes: {
    doc: { content: 'span' },
    span: {
      content: 'inline*',
      parseDOM: [{ tag: 'span' }],
      toDOM: () => ['span', 0]
    },
    text: { group: 'inline' }
  },
  marks: {
    strong: {
      parseDOM: [{ tag: 'strong' }],
      toDOM: () => ['strong', 0]
    }
  }
});

export const schema = new ProsemirrorSchema({
  nodes: {
    doc: {
      content: 'block+'
    },

    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM: () => ['p', 0]
    },

    blockquote: {
      content: 'block+',
      group: 'block',
      defining: true,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM: () => ['blockquote', 0]
    },

    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM: () => ['hr']
    },

    heading: {
      attrs: { level: { default: 1 }, showmore: { default: '' } },
      content: 'text*',
      group: 'block',
      defining: true,
      marks: '',

      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } }
      ],
      toDOM(node) {
        return ['h' + node.attrs.level, 0];
      }
    },

    code_block: {
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM: () => ['pre', ['code', 0]]
    },

    bullet_list: {
      content: 'list_item+',
      parseDOM: [{ tag: 'ul' }],
      toDOM: () => ['ul', 0],
      group: 'block'
    },

    ordered_list: {
      content: 'list_item+',
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: 'ol',
          getAttrs: (dom: HTMLElement) => ({
            order: dom.hasAttribute('start') ? dom.getAttribute('start') : 1
          })
        }
      ],
      toDOM: node => (node.attrs.order == 1 ? ['ol', 0] : ['ol', { start: node.attrs.order }, 0]),
      group: 'block'
    },

    list_item: {
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0],
      defining: true,
      content: 'paragraph block*'
    },

    text: { group: 'inline' },

    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      parseDOM: [{ tag: 'br' }],
      toDOM: () => ['br']
    },

    image: {
      ...svelteSchemaNode('img', { src: null, alt: '', style: 'regular' }),
      group: 'block'
    },

    cards: {
      ...svelteSchemaNode('cards', { style: 'default', cards: [{ heading: '', body: '' }] }),
      group: 'block'
    }
  },
  marks: {
    link: {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs(dom: Element | string) {
            if (dom instanceof Element) {
              return { href: dom.getAttribute('href'), title: dom.getAttribute('title') };
            } else throw new Error('DOM element expected');
          }
        }
      ],
      toDOM(node) {
        const { href, title } = node.attrs;
        return ['a', { href, title }, 0];
      }
    },

    em: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM: () => ['em', 0]
    },

    strong: {
      parseDOM: [
        { tag: 'strong' }
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        // { tag: 'b', getAttrs: (node) => node.style.fontWeight != 'normal' && null },
        // { style: 'font-weight', getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
      ],
      toDOM: () => ['strong', 0]
    },

    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0]
    }
  }
});

export type Schema = typeof schema;

export type NodeName = Schema extends ProsemirrorSchema<infer R> ? R : never;
