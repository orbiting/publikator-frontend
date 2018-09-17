import TreeUtils from 'immutable-treeutils'
import { Seq, List, Map } from 'immutable'

const tree = new TreeUtils(
  Seq(['document']),
  'key',
  'nodes'
)

export const getSelectionPath = value => {
  return List([value.selection.start.key])
    .map(key => tree.byId(value, key))
    .filter(Boolean)
    .reduce(
      (memo, path) =>
        memo
          .push(path)
          .concat(tree.ancestors(value, path)),
      List()
    )
    .reduceRight(
      (memo, path) =>
        memo.set(tree.id(value, path), path),
      Map()
    )
    .map(value.getIn.bind(value))
    .filter(n => n.object !== 'text')
    .toList()
}

export const getChildIndex = (value, node) => {
  return tree.childIndex(value, node.key)
}

export const isCompleteBlockSelected = value =>
  value.startBlock === value.endBlock ||
  (value.document.getNextBlock(
    value.startBlock.key
  ) === value.endBlock &&
    value.selection.start.offset === 0 &&
    value.selection.end.offset === 0)
