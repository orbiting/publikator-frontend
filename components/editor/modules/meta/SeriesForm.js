import React, { Fragment, useEffect } from 'react'
import { Set, Map } from 'immutable'

import {
  A,
  Label,
  Radio,
  Field,
  Dropdown,
  Checkbox
} from '@project-r/styleguide'

import MetaForm from '../../utils/MetaForm'
import withT from '../../../../lib/withT'

import RepoSelect from './RepoSelect'
import UIForm from '../../UIForm'
import MdClose from 'react-icons/lib/md/close'
import { css } from 'glamor'
import ColorPicker from '../../utils/ColorPicker'

const styles = {
  subContainer: css({
    display: 'flex',
    paddingBottom: 10
  }),
  colorPicker: css({
    flex: 1
  }),
  episode: css({
    padding: '5px 0 20px',
    borderBottom: '1px dashed'
  })
}

export default withT(({ t, editor, node }) => {
  const coverTextAnchors = [null, 'top', 'middle', 'bottom'].map(value => ({
    value,
    text: t(`metaData/series/coverText/anchor/${value}`)
  }))

  const value = node.data.get('series')

  const onChange = key => newValue => {
    editor.change(change => {
      change.setNodeByKey(node.key, {
        data:
          newValue !== null
            ? node.data.set(key, newValue)
            : node.data.remove(key)
      })
    })
  }
  const onSeriesChange = onChange('series')

  const isEpisode = typeof value === 'string'
  const isMaster = !!value && !isEpisode

  useEffect(() => {
    if (isMaster) {
      onSeriesChange({
        ...value,
        episodes: value.episodes.map(episode => {
          return {
            ...episode,
            parts: episode.parts || []
          }
        })
      })
    }
  }, [])

  const role = (
    <Fragment>
      <Radio
        checked={value === undefined}
        onChange={event => {
          event.preventDefault()

          onSeriesChange(undefined)
        }}
      >
        {t('metaData/series/negative')}
      </Radio>{' '}
      &nbsp;{' '}
      <Radio
        checked={isMaster}
        onChange={event => {
          event.preventDefault()
          onSeriesChange({
            title: '',
            episodes: [
              {
                title: '',
                publishDate: '',
                document: null,
                parts: []
              }
            ]
          })
        }}
      >
        {t('metaData/series/master')}
      </Radio>{' '}
      &nbsp;{' '}
      <Radio
        checked={isEpisode}
        onChange={event => {
          event.preventDefault()
          onSeriesChange('')
        }}
      >
        {t('metaData/series/episode')}
      </Radio>
    </Fragment>
  )

  const episodes = isMaster && value.episodes
  const onEpisodesChange = episodes => {
    onSeriesChange({
      ...value,
      episodes: episodes
    })
  }

  const coverText = node.data.get('coverText')

  return (
    <Fragment>
      <Label>{t('metaData/series/label')}</Label>
      <br />
      {role}
      {(isMaster || isEpisode) && (
        <UIForm getWidth={() => '25%'}>
          <Dropdown
            black
            label={t('metaData/series/coverText/anchor')}
            items={coverTextAnchors}
            value={coverText ? coverText.anchor : null}
            onChange={({ value }) =>
              onChange('coverText')(
                value && {
                  anchor: value,
                  offset:
                    value === 'middle'
                      ? ''
                      : (coverText && coverText.offset) || '5%',
                  color: (coverText && coverText.color) || '#fff'
                }
              )
            }
          />
          {coverText && (
            <Field
              black
              label={t('metaData/series/coverText/color')}
              value={coverText.color}
              onChange={(_, color) => {
                onChange('coverText')({
                  ...coverText,
                  color
                })
              }}
            />
          )}
          {coverText && (
            <Field
              black
              label={t('metaData/series/coverText/fontSize')}
              value={coverText.fontSize}
              onChange={(_, fontSize) => {
                onChange('coverText')({
                  ...coverText,
                  fontSize
                })
              }}
            />
          )}
          {coverText && (
            <Field
              black
              label={t('metaData/series/coverText/offset')}
              value={coverText.offset}
              onChange={(_, offset) => {
                onChange('coverText')({
                  ...coverText,
                  offset
                })
              }}
            />
          )}
        </UIForm>
      )}
      {isEpisode && (
        <RepoSelect
          label={t('metaData/series/master')}
          value={value}
          onChange={(_, url) => {
            onSeriesChange(url || '')
          }}
        />
      )}
      {isMaster && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '5px 10px 10px',
            marginTop: 5
          }}
        >
          <Field
            label={t('metaData/series/title/label')}
            value={value.title}
            onChange={(_, title) => {
              onSeriesChange({
                ...value,
                title: title
              })
            }}
          />

          <div {...styles.subContainer}>
            <Checkbox
              checked={value.displayParents}
              onChange={(_, checked) => {
                onSeriesChange({ ...value, displayParents: checked })
              }}
            >
              Link parent documents on article
            </Checkbox>
          </div>

          <div {...styles.subContainer}>
            <div {...styles.colorPicker}>
              <ColorPicker
                label='Primary color'
                value={value.primaryColor}
                onChange={primaryColor => {
                  onSeriesChange({ ...value, primaryColor })
                }}
              />
            </div>
            <div {...styles.colorPicker}>
              <ColorPicker
                label='Text color'
                value={value.textColor}
                onChange={textColor => {
                  onSeriesChange({ ...value, textColor })
                }}
              />
            </div>
            <div {...styles.colorPicker}>
              <ColorPicker
                label='Background color'
                value={value.bgColor}
                onChange={bgColor => {
                  onSeriesChange({ ...value, bgColor })
                }}
              />
            </div>
          </div>

          {episodes.map((episode, i) => {
            const { document: episodeDoc, parts, ...values } = episode
            const keys = Set(['label', 'title', 'image', 'publishDate'])
            const defaultValues = Map(keys.map(key => [key, '']))

            const onEpisodeFieldChange = key => (_, keyValue) => {
              onEpisodesChange(
                episodes
                  .slice(0, i)
                  .concat({
                    ...episode,
                    [key]: keyValue
                  })
                  .concat(episodes.slice(i + 1))
              )
            }

            const onPartsChange = partsValue =>
              onEpisodeFieldChange('parts')(undefined, partsValue)

            return (
              <div key={`episode-${i}`} {...styles.episode}>
                <div>
                  <Label>
                    <b>
                      {t('metaData/series/episodes/label')} #{i + 1}
                    </b>
                  </Label>
                  <A
                    href='#remove'
                    onClick={e => {
                      e.preventDefault()
                      onEpisodesChange(
                        episodes.slice(0, i).concat(episodes.slice(i + 1))
                      )
                    }}
                    style={{ float: 'right' }}
                  >
                    <MdClose size={20} fill='#000' />
                  </A>
                </div>
                <MetaForm
                  data={defaultValues.merge(values)}
                  onInputChange={onEpisodeFieldChange}
                  getWidth={() => '50%'}
                />
                <RepoSelect
                  label={t('metaData/series/episodes/document')}
                  value={episodeDoc}
                  onChange={(_, url) => {
                    onEpisodeFieldChange('document')(undefined, url)
                  }}
                />
                <div>
                  {parts && parts.length ? <Label>Parts</Label> : <br />}
                  {parts &&
                    parts.map((part, j) => {
                      const { document: partDoc, title } = part

                      const onPartFieldChange = key => keyValue => {
                        onPartsChange(
                          parts
                            .slice(0, j)
                            .concat({
                              ...part,
                              [key]: keyValue
                            })
                            .concat(parts.slice(j + 1))
                        )
                      }

                      return (
                        <div key={`part-${j}`}>
                          <Label>
                            Part #{j + 1}{' '}
                            <A
                              href='#remove'
                              onClick={e => {
                                e.preventDefault()
                                onPartsChange(
                                  parts.slice(0, j).concat(parts.slice(j + 1))
                                )
                              }}
                            >
                              (remove)
                            </A>
                          </Label>
                          <Field
                            label='Title'
                            value={title}
                            onChange={(e, value) =>
                              onPartFieldChange('title')(value)
                            }
                          />
                          <RepoSelect
                            label={t('metaData/series/episodes/document')}
                            value={partDoc}
                            onChange={(_, url) => {
                              onPartFieldChange('document')(url)
                            }}
                          />
                        </div>
                      )
                    })}
                  <A
                    href='#addPart'
                    onClick={e => {
                      e.preventDefault()
                      onPartsChange(
                        parts.concat({
                          title: '',
                          document: null
                        })
                      )
                    }}
                  >
                    <small>Add part</small>
                  </A>
                </div>
              </div>
            )
          })}
          <br />
          <A
            href='#add'
            onClick={e => {
              e.preventDefault()
              onEpisodesChange(
                episodes.concat({
                  title: '',
                  publishDate: '',
                  document: null
                })
              )
            }}
          >
            {t('metaData/series/episodes/add')}
          </A>
        </div>
      )}
      <br />
      <br />
    </Fragment>
  )
})
