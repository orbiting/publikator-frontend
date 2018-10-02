import { map, pick } from 'ramda'
import { connect } from 'react-redux'
import {
  colors,
  fontStyles,
  mediaQueries
} from '@project-r/styleguide'
import layoutFactory from './layout'
import buttonsFactory from './buttons'

export const SET_THEME_CONFIG = 'THEME_SET_CONFIG_VALUE'

export const setThemeConfig = values => ({
  type: SET_THEME_CONFIG,
  payload: values
})

const applyFactories = (factories, config) =>
  map(f => f(config), factories)

const defaultFactories = {
  layout: layoutFactory,
  buttons: buttonsFactory,
  colors: () => colors,
  fontStyles: () => fontStyles,
  mediaQueries: () => mediaQueries
}

const api = {
  relativeAttributes: obj => ({
    style: { position: 'relative' },
    ...obj
  })
}

const initialConfig = {
  align: 'left',
  style: 'fluid',
  maxWidth: '245px'
}

const initialState = {
  config: initialConfig,
  theme: applyFactories(defaultFactories, initialConfig)
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_THEME_CONFIG:
      const newConfig = {
        ...state.config,
        ...pick(Object.keys(initialConfig), payload)
      }
      return {
        theme: applyFactories(defaultFactories, newConfig),
        config: newConfig
      }
    default:
      return state
  }
}

export const withThemeConfig = connect(
  ({ theme: state }) => ({
    themeConfig: state.config
  }),
  dispatch => ({
    setThemeConfig: v => dispatch(setThemeConfig(v))
  })
)

export const withTheme = factory =>
  connect(
    ({ theme: state }) => ({
      styles: {
        ...((factory &&
          factory({
            theme: state.theme,
            config: state.config
          })) ||
          {}),
        api,
        ...state.theme
      }
    }),
    () => ({})
  )
