import { linkRule, Label } from '@project-r/styleguide'
import styles from './styles'

const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/

const shortString = (threshold, str) =>
  str && str.length > threshold
    ? str.substr(0, threshold - 3).concat('...')
    : str

const shortUrl = str =>
  (str && str.replace(/^http(s?):\/\/(www.)?/g, '')) || ''

export const getUrl = str => (exp.test(str) ? str : null)

export default ({ placeholder, label, value, ...props }) => {
  const url = getUrl(value)
  return (
    <div {...props}>
      <div>
        <Label>{label}</Label>
      </div>
      <div>
        <div {...styles.card}>
          <div {...styles.cardTitle}>
            {shortString(30, shortUrl(url)) || (
              <span {...styles.cardSelect}>{placeholder}</span>
            )}
          </div>
          {url && (
            <div {...styles.cardActions}>
              <Label>
                <a
                  href={url}
                  {...linkRule}
                  target='_blank'
                  onClick={e => e.stopPropagation()}
                >
                  In neuem Tab öffnen
                </a>
              </Label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
