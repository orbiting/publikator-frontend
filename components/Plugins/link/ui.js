import { Fragment } from 'react'
import { compose } from 'ramda'
import { Label, A } from '@project-r/styleguide'
import { css } from 'glamor'
import { reduxForm, Field } from 'redux-form'

import { FaLink as LinkIcon } from 'react-icons/fa'

import ToggleInlineButton from '../../Editor/components/ToggleInlineButton'
import TextInput from '../../Editor/components/TextInput'
import Button from '../../Editor/components/Button'
import Selected from '../../Editor/components/Selected'
import { SidebarBottom } from '../../Editor/components/UI'
import { withNodeData } from '../../Editor/apps/nodeData'
import { withEditMode } from '../../Editor/apps/editMode'
import { withTheme } from '../../Editor/apps/theme'

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
    marginBottom: '15px',
  }),
  cardLink: css({
    ...theme.fontStyles.sansSerifRegular16,
    display: 'block',
  }),
  cardLabel: css({
    ...theme.fontStyles.sansSerifRegular12,
  }),
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
        <A target="_blank" href={data.get('url')}>
          In neuem Tab öffnen
        </A>
      </Label>
    </div>
  )
)

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}) => (
  <TextInput
    renderInput={props => (
      <input
        autoComplete="off"
        {...props}
        {...input}
      />
    )}
    type={type}
    label={label}
    {...input}
    error={touched && error}
  />
)

export const LinkForm = compose(
  withNodeData({
    factory: (data, onChange) => ({
      initialValues: data.toJS(),
      onSubmit: onChange,
    }),
  }),
  withTheme(),
  reduxForm({
    form: 'link',
    enableReinitialize: true,
  })
)(
  ({
    handleSubmit,
    pristine,
    reset,
    submitting,
    styles,
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="url"
          type="text"
          component={renderField}
          label="URL"
        />
        <Field
          name="title"
          type="text"
          component={renderField}
          label="Titel"
        />
        <div>
          <Button
            {...styles.buttons.labelButton}
            type="submit"
            disabled={submitting}
          >
            OK
          </Button>
          <Button
            {...styles.buttons.labelButton}
            type="button"
            disabled={pristine || submitting}
            onClick={reset}
          >
            Rückgängig
          </Button>
        </div>
      </form>
    )
  }
)

export const LinkUI = compose(
  withTheme(),
  withEditMode({
    namespace: 'link',
  })
)(
  ({
    node,
    editor,
    isInEditMode,
    startEditing,
    finishEditing,
    styles,
  }) => {
    return (
      <Selected node={node}>
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
                  {...styles.buttons.labelButton}
                  onClick={startEditing}
                >
                  Bearbeiten
                </Button>
              </Fragment>
            ) : (
              <LinkForm
                node={node}
                editor={editor}
                onSubmitSuccess={() => {
                  finishEditing()
                }}
              />
            )}
          </div>
        </SidebarBottom>
      </Selected>
    )
  }
)
