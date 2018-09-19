import { Fragment } from 'react'
import { Text } from 'slate'
import { FaListOl as OrderedListIcon } from 'react-icons/fa'
import { FaListUl as UnorderedListIcon } from 'react-icons/fa'

import { Label } from '@project-r/styleguide'

import { isBlock } from '../../Editor/lib'
import FormatBlockButton from '../../Editor/components/FormatBlockButton'

import { withTheme } from '../../Editor/apps/theme'
import Selected from '../../Editor/components/Selected'
import {
  SidebarTextOptions,
  SidebarInsertOptions,
  SidebarBlockOptions,
  SidebarFormatOptions,
} from '../../Editor/components/UI'

import {
  TextButtons,
  InsertButtons,
} from '../common/ui'
import { ParagraphButton } from '../paragraph/ui'
import { SubheadButton } from '../subhead/ui'
import { BoldButton } from '../bold/ui'
import { ItalicButton } from '../italic/ui'
import { LinkButton } from '../link/ui'

const conversionStrategy = isOrdered => (
  change,
  node
) => {
  if (isBlock('list', node)) {
    const res = change.setNodeByKey(node.key, {
      data: {
        ordered: isOrdered,
      },
    })
    return res
  }

  return change
    .setNodeByKey(node.key, {
      type: 'listItem',
      nodes: Text.create(node.text),
    })
    .wrapBlockByKey(node.key, {
      type: 'list',
      data: {
        ordered: isOrdered,
        compact: true,
      },
    })
}

const toFlatBlockConversion = (
  change,
  node,
  block
) => {
  return node.nodes.reduce(
    (t, listItem) =>
      t
        .setNodeByKey(listItem.key, {
          type: block,
        })
        .unwrapBlockByKey(listItem.key),
    change
  )
}

export const OrderedListButton = withTheme()(
  props => (
    <FormatBlockButton
      {...props}
      {...props.styles.buttons.iconButton}
      active={
        isBlock('list', props.node) &&
        props.node.data.get('ordered') === true
      }
      block={'list'}
      conversionStrategy={conversionStrategy(
        true
      )}
    >
      <OrderedListIcon size={22} />
    </FormatBlockButton>
  )
)

export const UnorderedListButton = withTheme()(
  props => (
    <FormatBlockButton
      {...props}
      {...props.styles.buttons.iconButton}
      active={
        isBlock('list', props.node) &&
        props.node.data.get('ordered') === false
      }
      block={'list'}
      conversionStrategy={conversionStrategy(
        false
      )}
    >
      <UnorderedListIcon size={22} />
    </FormatBlockButton>
  )
)

export const ListUI = withTheme()(
  ({ styles, editor }) => {
    return (
      <Selected nodeType="list">
        {({ node }) => (
          <Fragment>
            <SidebarInsertOptions>
              <InsertButtons
                node={node}
                editor={editor}
              />
            </SidebarInsertOptions>

            <SidebarBlockOptions>
              <div {...styles.layout.container}>
                <div
                  {...styles.layout.sectionHeader}
                >
                  <Label>Block</Label>
                </div>
                <div {...styles.layout.actions}>
                  <ParagraphButton
                    node={node}
                    editor={editor}
                    conversionStrategy={
                      toFlatBlockConversion
                    }
                  />
                  <SubheadButton
                    node={node}
                    editor={editor}
                    conversionStrategy={
                      toFlatBlockConversion
                    }
                  />
                  <UnorderedListButton
                    node={node}
                    editor={editor}
                  />
                  <OrderedListButton
                    node={node}
                    editor={editor}
                  />
                </div>
              </div>
            </SidebarBlockOptions>
            <SidebarFormatOptions>
              <div {...styles.layout.container}>
                <div
                  {...styles.layout.sectionHeader}
                >
                  <Label>Format</Label>
                </div>
                <div {...styles.layout.actions}>
                  <BoldButton
                    node={node}
                    editor={editor}
                  />
                  <ItalicButton
                    node={node}
                    editor={editor}
                  />
                  <LinkButton
                    node={node}
                    editor={editor}
                  />
                </div>
              </div>
            </SidebarFormatOptions>
            <SidebarTextOptions>
              <TextButtons
                node={node}
                editor={editor}
              />
            </SidebarTextOptions>
          </Fragment>
        )}
      </Selected>
    )
  }
)

export const renderUI = ({ editor }) => {
  return <ListUI exitor={editor} />
}
