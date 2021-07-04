import React, { useState } from 'react'
import {
  Label,
  fontStyles,
  plainButtonRule,
  Button,
  A,
  Interaction
} from '@project-r/styleguide'
import { baseCharts } from './config'
import { css, merge } from 'glamor'
import { JSONEditor, PlainEditor } from '../../../utils/CodeEditorFields'
import BackIcon from 'react-icons/lib/md/chevron-left'
import { styles as overlayStyles } from '../../../utils/OverlayForm'

const styles = {
  chartWrapper: css({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gridAutoRows: 120
  }),
  chartButtonContainer: css({
    height: '100%',
    display: 'flex'
  }),
  chartButton: css({
    height: 80,
    width: 120,
    whiteSpace: 'nowrap',
    textAlign: 'center',
    ...fontStyles.sansSerifRegular14,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ':hover': {
      textDecoration: 'underline'
    }
  }),
  chartImage: css({
    maxWidth: 60,
    maxHeight: 30,
    marginTop: 'auto'
  }),
  chartImageLarge: css({
    maxWidth: 130,
    maxHeight: 50
  }),
  chartButtonText: css({
    display: 'block',
    marginTop: 'auto',
    ':hover': {
      textDecoration: 'underline'
    }
  }),
  discreteButton: css({
    display: 'block',
    marginBottom: 30
  }),
  buttons: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  })
}

const ChartPreview = ({ CsvChart, chart }) => {
  const values = chart.values.trim()
  return (
    <>
      <Interaction.P>{chart.name}</Interaction.P>
      <div {...overlayStyles.edit}>
        <JSONEditor label='Einstellungen' config={chart.config} readOnly />
        <PlainEditor
          label='CSV Daten'
          value={values}
          linesShown={10}
          readOnly
        />
      </div>
      <div {...overlayStyles.preview}>
        <CsvChart config={chart.config} values={values} />
      </div>
      <br style={{ clear: 'both' }} />
    </>
  )
}

const ChartSelector = ({ onChange, data, CsvChart, setTab }) => {
  const [preselected, preselect] = useState()
  const config = data.get('config') || {}

  const onSelect = (chart, configOnly = false) => {
    onChange(
      data
        .set('config', {
          ...chart.config,
          size: config.size
        })
        .set('values', configOnly ? data.get('values') : chart.values.trim())
    )
    preselect(undefined)
    setTab('chart')
  }
  const hasChanges = data.get('values') != '' || !!config.type
  return preselected ? (
    <>
      <Label>
        <button
          {...plainButtonRule}
          {...styles.discreteButton}
          onClick={() => preselect(undefined)}
        >
          <BackIcon size={16} /> Vorlage durchsuchen
        </button>
      </Label>
      <ChartPreview
        chart={preselected}
        CsvChart={CsvChart}
        onSelect={onSelect}
      />
      <div {...styles.buttons}>
        <Button onClick={() => onSelect(preselected)}>Überschreiben</Button>
        <Interaction.P style={{ marginLeft: 30 }}>
          <A href='#copy-settings' onClick={() => onSelect(preselected, true)}>
            Einstellungen kopieren
          </A>
        </Interaction.P>
      </div>
    </>
  ) : (
    <div {...styles.chartWrapper}>
      {baseCharts.map(chart => {
        return (
          <div key={chart.name} {...styles.chartButtonContainer}>
            <div
              {...styles.chartButton}
              onClick={() => (hasChanges ? preselect(chart) : onSelect(chart))}
            >
              <img
                src={chart.screenshot}
                {...merge(
                  styles.chartImage,
                  chart.large && styles.chartImageLarge
                )}
              />
              <span {...styles.chartButtonText}>{chart.name}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChartSelector