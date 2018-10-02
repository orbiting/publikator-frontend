import {
  MdArrowUpward as MoveUpIcon,
  MdArrowDownward as MoveDownIcon,
  MdAdd as AddIcon,
  MdDelete as DeleteIcon
} from 'react-icons/md'
import { compose } from 'ramda'
import { Label } from '@project-r/styleguide'
import Selected from '../../base/components/Selected'
import { SidebarEditOptions } from '../../base/components/UI'
import { withTheme } from '../../base/apps/theme'
import { withEditMode } from '../../base/apps/editMode'
import {
  moveUp,
  moveDown,
  insertBlockBefore,
  removeBlock
} from '../../base/lib/changes'

const withStyles = withTheme()

const AddButton = withStyles(({ styles, ...props }) => (
  <button {...props} {...styles.buttons.iconButton}>
    <AddIcon size={24} />
  </button>
))

const MoveUpButton = withStyles(({ styles, ...props }) => (
  <button {...props} {...styles.buttons.iconButton}>
    <MoveUpIcon size={24} />
  </button>
))

const MoveDownButton = withStyles(({ styles, ...props }) => (
  <button {...props} {...styles.buttons.iconButton}>
    <MoveDownIcon size={24} />
  </button>
))

const DeleteButton = withStyles(({ styles, ...props }) => (
  <button {...props} {...styles.buttons.iconButton}>
    <DeleteIcon size={24} />
  </button>
))

const InsertPanel = withStyles(
  ({ styles, onSelect, onClose, items }) => (
    <div
      {...styles.layout.vSection}
      style={{ backgroundColor: '#fff' }}
    >
      <div {...styles.layout.backdrop} onClick={onClose} />
      {items.map(({ text, value }) => (
        <button
          key={text}
          style={{ position: 'relative' }}
          {...styles.buttons.textButton}
          onClick={() => onSelect(value())}
        >
          {text}
        </button>
      ))}
    </div>
  )
)

export default ({ isNode, isChildNode, insertItems, offset }) => {
  const withStuff = compose(
    withStyles,
    withEditMode({ namespace: 'insertPanel' })
  )

  return withStuff(
    ({
      editor,
      styles,
      isInEditMode,
      startEditing,
      finishEditing
    }) => {
      return (
        <Selected isNode={isChildNode} offset={offset}>
          {({ node }) => {
            const parent = editor.value.document.getParent(node.key)
            if (!parent || !isNode(parent)) {
              return
            }

            const isLast = node === parent.nodes.last()
            const isFirst = node === parent.nodes.first()
            const canDelete = parent.nodes.size > 1
            return (
              <SidebarEditOptions>
                <div {...styles.layout.container}>
                  <div {...styles.layout.sectionHeader}>
                    <Label>Bearbeiten</Label>
                  </div>
                  <div {...styles.layout.iconGroup}>
                    <AddButton
                      disabled={!insertItems || !insertItems.length}
                      onClick={() => startEditing()}
                    />
                    <MoveUpButton
                      disabled={isFirst}
                      onClick={() => editor.change(moveUp, node)}
                    />
                    <MoveDownButton
                      disabled={isLast}
                      onClick={() => editor.change(moveDown, node)}
                    />
                    <DeleteButton
                      disabled={!canDelete}
                      onClick={() => editor.change(removeBlock, node)}
                    />
                  </div>
                  {isInEditMode && (
                    <InsertPanel
                      items={insertItems}
                      onClose={finishEditing}
                      onSelect={newNode => {
                        editor.change(
                          insertBlockBefore,
                          newNode,
                          node
                        )
                        finishEditing()
                      }}
                    />
                  )}
                </div>
              </SidebarEditOptions>
            )
          }}
        </Selected>
      )
    }
  )
}
