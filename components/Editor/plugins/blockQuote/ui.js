import { Fragment } from 'react'
import { Text } from 'slate'
import { FaQuoteRight as BlockQuoteIcon } from 'react-icons/fa'

import { Label } from '@project-r/styleguide'

import { isBlock } from '../../base/lib'
import FormatBlockButton from '../../base/components/FormatBlockButton'

import { withTheme } from '../../base/apps/theme'
import Selected from '../../base/components/Selected'
import {
  SidebarTextOptions,
  SidebarBlockOptions,
  SidebarFormatOptions
} from '../../base/components/UI'

import { TextButtons } from '../common/ui'
import { ParagraphButton } from '../paragraph/ui'
import { BoldButton } from '../bold/ui'
import { ItalicButton } from '../italic/ui'
import { LinkButton } from '../link/ui'

const conversionStrategy = (change, node) => {
  return change
    .setNodeByKey(node.key, {
      type: 'blockQuoteText',
      nodes: Text.create(node.text)
    })
    .wrapBlockByKey(node.key, {
      type: 'blockQuote'
    })
}

const toFlatBlockConversion = (change, node, block) => {
  return node.nodes.reduce(
    (t, item) =>
      !isBlock('caption', item)
        ? t
          .setNodeByKey(item.key, {
            type: block
          })
          .unwrapBlockByKey(item.key)
        : t,
    change
  )
}

export const BlockQuoteButton = withTheme()(props => (
  <FormatBlockButton
    {...props}
    {...props.styles.buttons.iconButton}
    active={
      isBlock('list', props.node) &&
      props.node.data.get('ordered') === true
    }
    block={'list'}
    conversionStrategy={conversionStrategy}
  >
    <BlockQuoteIcon size={22} />
  </FormatBlockButton>
))

export const BlockQuoteUI = withTheme()(({ styles, editor }) => {
  return (
    <Selected isNode='list' offset={1}>
      {({ node }) => (
        <Fragment>
          <SidebarBlockOptions>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Block</Label>
              </div>
              <div {...styles.layout.actions}>
                <ParagraphButton
                  node={node}
                  editor={editor}
                  conversionStrategy={toFlatBlockConversion}
                />
                <BlockQuoteButton node={node} editor={editor} />
              </div>
            </div>
          </SidebarBlockOptions>
          <SidebarFormatOptions>
            <div {...styles.layout.container}>
              <div {...styles.layout.sectionHeader}>
                <Label>Format</Label>
              </div>
              <div {...styles.layout.actions}>
                <BoldButton node={node} editor={editor} />
                <ItalicButton node={node} editor={editor} />
                <LinkButton node={node} editor={editor} />
              </div>
            </div>
          </SidebarFormatOptions>
          <SidebarTextOptions>
            <TextButtons node={node} editor={editor} />
          </SidebarTextOptions>
        </Fragment>
      )}
    </Selected>
  )
})

export const renderUI = ({ editor }) => {
  return <BlockQuoteUI editor={editor} />
}
