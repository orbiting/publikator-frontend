import React from 'react'

let _key = 0
export const getKey = () => {
  _key = _key + 1
  return _key
}

const readImage = onChange => e => {
  const files = e.target.files

  if (files.length < 1) {
    return
  }
  const file = files[0]

  const reader = new window.FileReader()
  const [type] = file.type.split('/')
  if (type !== 'image') {
    return
  }

  reader.addEventListener('load', () =>
    onChange(reader.result)
  )
  reader.readAsDataURL(file)
}

export default ({
  // eslint-disable-next-line
  value, // remove invalid props to pass
  onChange,
  useAltKey = false,
  children,
  ...props
}) => {
  const key = getKey()
  return (
    <label
      onClick={e => {
        return (
          useAltKey &&
          (e.altKey === true ||
            e.preventDefault())
        )
      }}
      htmlFor={`fileinput-${key}`}
      {...props}
    >
      {children}
      {
        <input
          onChange={readImage(onChange)}
          style={{ display: 'none' }}
          id={`fileinput-${key}`}
          type='file'
          accept='image/*'
        />
      }
    </label>
  )
}
