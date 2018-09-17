import { Fragment } from 'react'
import { compose } from 'ramda'
import { css } from 'glamor'
import {
  reduxForm,
  Field as FormField,
} from 'redux-form'
import AutosizeInput from 'react-textarea-autosize'

import {
  Field,
  Button,
  Checkbox,
  Label,
} from '@project-r/styleguide'

import { withNodeData } from '../../Editor/apps/nodeData'
import { withTheme } from '../../Editor/apps/theme'
import RepoSelect from './RepoSelect'
import ImageInput from '../../Editor/components/ImageInput'

const withMetaStyles = withTheme(() => ({
  autoSize: css({
    minHeight: 40,
    paddingTop: '7px !important',
    paddingBottom: '6px !important',
  }),
  imageInputLabel: css({
    display: 'block',
    marginBottom: 5,
  }),
}))

const renderField = withMetaStyles(
  ({
    styles,
    input,
    label,
    type,
    meta: { touched, error },
  }) => {
    switch (input.name) {
      case 'title':
      case 'slug':
        return (
          <Field
            renderInput={props => (
              <input
                autoComplete="off"
                {...props}
              />
            )}
            type={type}
            label={label}
            {...input}
            error={touched && error}
          />
        )
      case 'feed':
      case 'gallery':
        return (
          <p>
            <Checkbox
              {...input}
              error={touched && error}
            >
              {label}
            </Checkbox>
          </p>
        )
      case 'format':
      case 'dossier':
      case 'discussion':
        return (
          <Fragment>
            <RepoSelect
              label={label}
              {...input}
            />
          </Fragment>
        )
      case 'description':
      case 'facebookDescription':
      case 'twitterDescription':
        return (
          <Field
            {...input}
            renderInput={props => (
              <AutosizeInput
                {...styles.autoSize}
                {...props}
              />
            )}
            type={type}
            label={label}
            {...input}
            error={touched && error}
          />
        )
      case 'image':
      case 'twitterImage':
      case 'facebookImage':
        return (
          <ImageInput {...input}>
            <Label {...styles.label}>
              {label}
            </Label>
            <img
              src={
                input.value ||
                '/static/placeholder.png'
              }
              style={{
                maxWidth: 200,
                width: input.value
                  ? undefined
                  : '100%',
              }}
              alt=""
            />
          </ImageInput>
        )
    }
  }
)

export const MetaUI = compose(
  withNodeData({
    factory: (data, onChange) => ({
      initialValues: data.toJS(),
      onSubmit: onChange,
    }),
  }),
  reduxForm({
    form: 'meta',
    enableReinitialize: true,
  })
)(
  ({
    handleSubmit,
    pristine,
    reset,
    submitting,
  }) => {
    return (
      <form onSubmit={handleSubmit}>
        <FormField
          name="title"
          type="text"
          component={renderField}
          label="Title"
        />
        <FormField
          name="description"
          type="text"
          component={renderField}
          label="Beschreibung"
        />
        <FormField
          name="slug"
          type="text"
          component={renderField}
          label="Slug"
        />
        <FormField
          name="feed"
          type="checkbox"
          component={renderField}
          label="Displays in Feed"
        />
        <FormField
          name="gallery"
          type="checkbox"
          component={renderField}
          label="Image gallery enabled for this article"
        />
        <FormField
          name="format"
          component={renderField}
          label="Format"
        />
        <FormField
          name="discussion"
          component={renderField}
          label="Diskussion"
        />

        <div>
          <Button
            type="submit"
            disabled={pristine || submitting}
          >
            OK
          </Button>
          <Button
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
