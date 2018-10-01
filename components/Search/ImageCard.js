import { linkRule, Label } from '@project-r/styleguide'
import styles from './styles'

export const isUrl = str => /^https?:\\\\/.test(str) && str
export const getImageTyoe = str => {
  const match = /[\w-]+.(jpe?g|gif|png|webp)/.exec(str)
  return match && match[1]
}

export default ({
  label,
  placeholder = 'Bild auswählen',
  value,
  ...props
}) => {
  const image = getImageTyoe(value)
  const isLocal = !isUrl(image)
  return (
    <div {...props}>
      <div>
        <Label>{label}</Label>
      </div>
      <div>
        <div {...styles.card}>
          <div {...styles.cardTitle}>
            {!image && (
              <span {...styles.cardSelect}>{placeholder}</span>
            )}
            {image && `${image.toUpperCase()}-Datei`}
          </div>
          {image && (
            <div {...styles.cardActions}>
              <Label>
                {!isLocal && (
                  <a
                    href={image}
                    {...linkRule}
                    target='_blank'
                    onClick={e => e.stopPropagation()}
                  >
                    In neuem Tab öffnen
                  </a>
                )}
                {isLocal && 'Lokales File'}
              </Label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
