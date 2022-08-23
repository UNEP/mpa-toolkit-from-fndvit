import { range } from '@mpa/utils';
import type { NodeType, ResolvedPos } from 'prosemirror-model';
import { schema } from '$lib/editor/schema';

export function getPath($resolved: ResolvedPos) {
  return range(0, $resolved.depth).map(i => $resolved.node(i));
}

export function isListNode(node: NodeType) {
  return node === schema.nodes.bullet_list || node === schema.nodes.ordered_list;
}
