import { renderStaticOptimized } from 'glamor/server'
import { Block } from 'slate'
import { SG_DYNAMIC_COMPONENT_BASE_URLS } from '../../../../lib/settings'

export const getNew = () =>
  Block.create({
    type: 'dynamicComponent',
    data: {
      src: (SG_DYNAMIC_COMPONENT_BASE_URLS || '').split(',')[0],
      autoHtml: true
    }
  })

export const getHtml = parentElement => {
  const { html, rules } = renderStaticOptimized(() => {
    return parentElement.innerHTML
  })

  // filter out global rules
  const css = rules
    .map(x => x.cssText)
    .filter(cssText => {
      return cssText.match(/css-([a-zA-Z0-9\-_]+)/gm)
    })
    .join('')

  return `<style>${css}</style>\n${html}`
}
