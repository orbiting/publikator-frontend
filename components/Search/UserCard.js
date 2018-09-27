import { Fragment } from 'react'
import {
  colors,
  linkRule,
  Label,
  InlineSpinner
} from '@project-r/styleguide'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styles from './styles'

export const getUserId = str => {
  const match = /~([0-9A-Za-z-]+)/.exec(str)
  return (match && match[1].trim()) || null
}

export const GET_USER = gql`
  query user($userId: String!) {
    user(slug: $userId) {
      id
      firstName
      lastName
      id
      roles
      email
    }
  }
`

export default ({ placeholder, label, value, ...props }) => {
  const userId = getUserId(value)
  return (
    <div {...props}>
      <div>
        <Label>{label}</Label>
      </div>
      <div>
        <Query
          query={GET_USER}
          skip={!value || !userId}
          variables={{ userId }}
        >
          {({ loading, data, error }) => {
            const isLoading = loading && userId

            if (error) {
              return (
                <Label style={{ color: colors.error }}>
                  {!console.error(error.toString()) &&
                    'Hoppla. Da ging was schief'}
                </Label>
              )
            }
            const { firstName, lastName, id, roles, email } =
              (data && data.user) || {}
            const fullName =
              firstName && lastName && `${firstName} ${lastName}`
            return (
              <div {...styles.card}>
                {isLoading && (
                  <span {...styles.cardLoading}>
                    <InlineSpinner size={35} />
                  </span>
                )}
                {!isLoading && (
                  <Fragment>
                    <div {...styles.cardTitle}>
                      {fullName ||
                        email || (
                        <span {...styles.cardSelect}>
                          {placeholder}
                        </span>
                      )}
                    </div>
                    {id && (
                      <Fragment>
                        <div {...styles.cardInfo}>
                          <Label>
                            {roles.includes('editor')
                              ? 'Autorin'
                              : roles.includes('member')
                                ? 'Member'
                                : 'Deplorable'}
                          </Label>
                          {email && <Label>{email}</Label>}
                        </div>
                        <div {...styles.cardActions}>
                          <Label>
                            <a
                              href={`https://www.republik.ch/~${id}`}
                              {...linkRule}
                              target='_blank'
                              onClick={e => e.stopPropagation()}
                            >
                              Zum Profil
                            </a>
                          </Label>
                        </div>
                      </Fragment>
                    )}
                  </Fragment>
                )}
              </div>
            )
          }}
        </Query>
      </div>
    </div>
  )
}
