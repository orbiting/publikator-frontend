import { css, merge } from 'glamor'
import { compose } from 'ramda'
import {
  Label,
  Field,
  Overlay,
  OverlayToolbar,
  OverlayToolbarClose,
  OverlayBody,
  Button
} from '@project-r/styleguide'

import RepoCard, { getRepoId } from '../../../../Search/RepoCard'
import URLCard from '../../../../Search/URLCard'
import RepoSearch from '../../../../Search/RepoSearch'
import withT from '../../../../../lib/withT'
import { AutoSlugLinkInfo } from '../../../../Github'

import Selected from '../../../base/components/Selected'
import { SidebarBottom } from '../../../base/components/UI'
import { withTheme } from '../../../base/apps/theme'
import { withEditMode } from '../../../base/apps/editMode'
import { updateData } from '../../../base/lib/changes'
import { isTeaser, cloneWithRepoData } from '../lib'

const TeaserURLCard = ({ value }) => {
  if (getRepoId(value)) {
    return <RepoCard value={value} label='Verlinktes Dokument' />
  }
  return <URLCard value={value} label='URL' placeholder='Auswählen' />
}
const TeaserFormatURLCard = ({ value }) => {
  return (
    <RepoCard
      value={value}
      label='Format'
      placeholder='Kein Format gesetzt.'
    />
  )
}

const withFormStyles = withTheme(({ theme }) => ({
  cardSection: merge(
    theme.layout.section,
    css({
      minWidth: 220,
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#fff'
      }
    })
  )
}))

const TeaserURLForm = withT(({ t, node, editor, onClose }) => {
  const url = node.data.get('url')
  const formatUrl = node.data.get('formatUrl')
  const onChange = data => {
    editor.change(updateData, node, data)
  }
  return (
    <Overlay onClose={onClose}>
      <OverlayToolbar>
        <OverlayToolbarClose onClick={onClose} />
      </OverlayToolbar>
      <OverlayBody>
        <Field
          label='URL'
          value={url}
          onChange={(_, v) => onChange({ url: v })}
        />
        <AutoSlugLinkInfo
          value={url}
          label={t('metaData/field/href/document')}
        />
        <Field
          label='Format URL'
          value={formatUrl}
          onChange={(_, v) => onChange({ formatUrl: v })}
        />
        <AutoSlugLinkInfo
          value={formatUrl}
          label={t('metaData/field/href/document')}
        />
        <RepoSearch
          label={'Von Artikel übernehmen'}
          value={''}
          onChange={({ value: repoData }) => {
            editor.change(change => {
              const newNode = cloneWithRepoData(node, repoData)
              return change.replaceNodeByKey(node.key, newNode)
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

export default compose(
  withFormStyles,
  withEditMode({
    namespace: 'teaserUrl'
  })
)(({ isInEditMode, startEditing, finishEditing, styles, editor }) => {
  return (
    <Selected isNode={isTeaser}>
      {({ node }) => (
        <SidebarBottom>
          <div {...styles.layout.container}>
            <div {...styles.sectionHeader}>
              <Label>{'Verlinkung'}</Label>
            </div>
            <hr {...styles.layout.hairline} />
            <div {...styles.cardSection} onClick={startEditing}>
              <TeaserURLCard value={node.data.get('url')} />
              <TeaserFormatURLCard
                value={node.data.get('formatUrl')}
              />
            </div>
            {isInEditMode && (
              <TeaserURLForm
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
