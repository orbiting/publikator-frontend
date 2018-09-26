import { compose } from 'ramda'
import { Text, Inline } from 'slate'
import {
  Label,
  Field,
  Overlay,
  OverlayToolbar,
  OverlayToolbarClose,
  OverlayBody,
  Button
} from '@project-r/styleguide'
import { css, merge } from 'glamor'

import { FaLink as LinkIcon } from 'react-icons/fa'
import RepoCard, { getRepoId } from '../../../Search/RepoCard'
import UserCard, { getUserId } from '../../../Search/UserCard'
import URLCard from '../../../Search/URLCard'
import RepoSearch from '../../../Search/RepoSearch'
import UserSearch from '../../../Search/UserSearch'
import withT from '../../../../lib/withT'

import ToggleInlineButton from '../../base/components/ToggleInlineButton'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'
import { withEditMode } from '../../base/apps/editMode'
import { withTheme } from '../../base/apps/theme'
import { updateData } from '../../base/lib/changes'

export const LinkButton = withTheme()(props => {
  return (
    <ToggleInlineButton
      inline={'link'}
      {...props}
      {...props.styles.buttons.iconButton}
    >
      <LinkIcon size={22} />
    </ToggleInlineButton>
  )
})

const LinkCard = ({ value }) => {
  if (getRepoId(value)) {
    return <RepoCard value={value} label='Dokument' />
  }
  if (getUserId(value)) {
    return <UserCard value={value} label='Verlinkter User' />
  }
  return <URLCard value={value} label='URL' />
}

const LinkForm = withT(({ t, node, editor, onClose }) => {
  const title = node.data.get('title')
  const href = node.data.get('href')
  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar>
        <OverlayToolbarClose onClick={onClose} />
      </OverlayToolbar>
      {href}
      <OverlayBody>
        <Field
          label={t(`metaData/field/href`, undefined, 'href')}
          value={href}
          onChange={(_, v) => {
            editor.change(updateData, node, {
              href: v
            })
          }}
        />
        <Field
          label={t(`metaData/field/title`, undefined, 'title')}
          value={title}
          onChange={(_, v) => {
            editor.change(updateData, node, {
              title: v
            })
          }}
        />
        <RepoSearch
          label={'Dokument'}
          value={''}
          onChange={repo => {
            editor.change(updateData, node, {
              title: repo.text,
              href: `https://github.com/${repo.value.id}?autoSlug`
            })
            onClose()
          }}
        />
        <UserSearch
          label={'Autor, Benutzer'}
          value={''}
          onChange={({ value: user }) => {
            editor.change(change => {
              return change.replaceNodeByKey(
                node.key,
                Inline.create({
                  type: 'link',
                  data: node.data.merge({
                    title: `${user.firstName} ${user.lastName}`,
                    href: `/~${user.id}`
                  }),
                  nodes: [
                    Text.create(`${user.firstName} ${user.lastName}`)
                  ]
                })
              )
            })
            onClose()
          }}
        />
        <Button primary onClick={onClose}>
          OK
        </Button>
      </OverlayBody>
    </Overlay>
  )
})

const withLinkUIStyles = withTheme(({ theme }) => ({
  cardSection: merge(
    theme.layout.section,
    css({
      minWidth: '120px',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#fff',
        cursor: 'pointer'
      }
    })
  )
}))

export const LinkUI = compose(
  withLinkUIStyles,
  withEditMode({
    namespace: 'link'
  })
)(({ isInEditMode, startEditing, finishEditing, styles, editor }) => {
  return (
    <Selected nodeType='link'>
      {({ node }) => (
        <SidebarBottom>
          <div {...styles.layout.container}>
            <div {...styles.sectionHeader}>
              <Label>Link</Label>
            </div>
            <hr {...styles.layout.hairline} />
            <div {...styles.cardSection} onClick={startEditing}>
              <LinkCard value={node.data.get('href')} />
            </div>
            {isInEditMode && (
              <LinkForm
                node={node}
                editor={editor}
                onClose={finishEditing}
              />
            )}
          </div>
        </SidebarBottom>
      )}
    </Selected>
  )
})

export const renderUI = ({ editor }) => {
  return <LinkUI editor={editor} />
}
