import React, { Fragment } from 'react'
import { Radio } from '@project-r/styleguide'
import { sizes } from '../config'

const SizeSelector = ({ onChange, data }) => {
  const config = data.get('config') || {}

  return (
    <>
      {sizes.map(({ label, size }) => {
        const checked = config.size === size
        return (
          <Fragment key={size || label}>
            <Radio
              checked={checked}
              onChange={() => {
                if (!checked) {
                  onChange(data.set('config', { ...config, size }))
                }
              }}
              style={{ whiteSpace: 'nowrap', marginRight: 10 }}
            >
              {label || size}
            </Radio>{' '}
          </Fragment>
        )
      })}
    </>
  )
}

export default SizeSelector
