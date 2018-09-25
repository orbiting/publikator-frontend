import { Fragment } from 'react'
import { compose } from 'ramda'
import { Label, A } from '@project-r/styleguide'
import { css } from 'glamor'

import { FaLink as LinkIcon } from 'react-icons/fa'

import ToggleInlineButton from '../../base/components/ToggleInlineButton'
import Button from '../../base/components/Button'
import Selected from '../../base/components/Selected'
import { SidebarBottom } from '../../base/components/UI'
import { withEditMode } from '../../base/apps/editMode'
import { withTheme } from '../../base/apps/theme'

const shortString = (threshold, str) =>
  str && str.length > threshold
    ? str.substr(0, threshold - 3).concat('...')
    : str

const shortUrl = str =>
  (str &&
    str.replace(/^http(s?):\/\/(www.)?/g, '')) ||
  ''

const getUrlType = str =>
  /^\/~/.test(str)
    ? 'User'
    : /github\.com/.test(str)
      ? 'Dokument'
      : 'Link'

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

const withCardStyles = withTheme(({ theme }) => ({
  card: css({
    marginBottom: '15px'
  }),
  cardLink: css({
    ...theme.fontStyles.sansSerifRegular16,
    display: 'block'
  }),
  cardLabel: css({
    ...theme.fontStyles.sansSerifRegular12
  })
}))

export const LinkCard = withCardStyles(
  ({ data, styles }) => (
    <div>
      <span {...styles.cardLink}>
        <span>
          {shortString(
            60,
            data.get('title') ||
              shortUrl(data.get('url'))
          )}
        </span>
      </span>
      <Label>
        {getUrlType(data.get('url'))}
        {' | '}
        <A target='_blank' href={data.get('url')}>
          In neuem Tab öffnen
        </A>
      </Label>
    </div>
  )
)

export const LinkUI = compose(
  withTheme(),
  withEditMode({
    namespace: 'link'
  })
)(
  ({
    isInEditMode,
    startEditing,
    finishEditing,
    styles,
    editor
  }) => {
    return (
      <Selected nodeType='link'>
        {({ node }) => (
          <SidebarBottom>
            <div {...styles.layout.container}>
              <div {...styles.sectionHeader}>
                <Label>Link</Label>
              </div>
              <hr {...styles.layout.hairline} />
              {!isInEditMode ? (
                <Fragment>
                  <LinkCard data={node.data} />
                  <Button
                    {...styles.buttons
                      .labelButton}
                    onClick={startEditing}
                  >
                    Bearbeiten
                  </Button>
                </Fragment>
              ) : (
                <h4>Hello Edit</h4>
              )}
            </div>
          </SidebarBottom>
        )}
      </Selected>
    )
  }
)

export const renderUI = ({ editor }) => {
  return <LinkUI editor={editor} />
}
