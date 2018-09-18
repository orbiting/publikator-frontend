import { transform } from '../../../lib/transform/transform'
import { Map } from 'immutable'

const compatKeys = key => {
  switch (key) {
    /*
      center
    */
    case 'center':
      return key

    /*
      Captions
    */
    case 'figureCaption':
    case 'figureCaption_CENTERFIGURECAPTION':
    case 'figureCaption_INFOFIGURECAPTION':
      return 'caption'

    case 'paragraph_BYLINE':
    case 'paragraph_CENTERBYLINE':
      return 'captionByline'

    /*
      Figures
    */
    case 'figure':
    case 'figure_CENTERFIGURE':
      return 'figure'

    case 'figure_INFOFIGURE':
      return 'infoBoxFigure'
    case 'figuregroup':
      return 'figureGroup'
    case 'figureImage':
      return key

    /*
      Title block
    */
    case 'title':
      return 'titleBlock'
    case 'headline_H1':
      return 'title'
    case 'paragraph_LEAD':
      return 'lead'
    case 'paragraph_CREDIT':
      return 'credits'

    /*
      Block elements
    */
    case 'headline_H2':
      return 'subhead'
    case 'paragraph':
      return key

    /*
      Infobox
    */
    case 'headline_INFOH':
      return 'infoBoxTitle'
    case 'paragraph_INFOP':
      return 'infoBoxText'
    case 'infobox':
      return 'infoBox'

    /*
      Links
    */
    case 'link':
      return key

    /*
      Lists
    */
    case 'list':
    case 'listItem':
      return key

    /*
      Marks
    */
    case 'mark_EMPHASIS':
      return 'italic'
    case 'mark_STRONG':
      return 'bold'
    case 'mark_sub':
      return 'sub'
    case 'mark_sup':
      return 'sup'
    default:
    // console.log('missing', key)
  }
}

/*
articleCollection_ARTICLECOLLECTION
articleGroup_ARTICLETILEROW
blockquote
blocktext
center
chart
chartCanvas
documentPlain
dynamiccomponent
embedTwitter
embedVideo

headline_ARTICLECOLLECTIONSUBHEADER
headline_ARTICLETILELEAD
headline_ARTICLETILETITLE
headline_CHARTTITLE
headline_FRONTFORMAT
headline_FRONTSUBJECT

headline_LOGBOOK_TITLE
html

line
link_FRONTLINK
logbook

meta
paragraph_BLOCKQUOTEPARAGRAPH

paragraph_CHARTLEAD
paragraph_CHARTNOTE
paragraph_FRONTCREDIT
paragraph_LOGBOOK_CREDIT
paragraph_NOTEP
paragraph_QUOTECITE
paragraph_QUOTEP
quote
specialchars
teaser_ARTICLETILE
*/

export default rootRule => {
  return Map().withMutations(schema => {
    const walkRules = transform((rule, next) => {
      if (!rule) {
        return
      }
      if (rule.editorModule) {
        const key = compatKeys(
          rule.editorOptions &&
          rule.editorOptions.type
            ? `${rule.editorModule}_${
                rule.editorOptions.type
              }`
            : rule.editorModule
        )
        if (key) {
          schema.set(key, rule)
        }
      }
      if (rule.rules) {
        next(rule.rules)
      }
    })
    walkRules(rootRule)
    return schema
  })
}
