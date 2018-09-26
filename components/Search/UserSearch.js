import React, { Component } from 'react'
import { Autocomplete } from '@project-r/styleguide'
import { graphql } from 'react-apollo'
import withT from '../../lib/withT'
import gql from 'graphql-tag'

export const getUsers = gql`
  query getUsers($search: String!) {
    users(search: $search) {
      firstName
      lastName
      email
      id
    }
  }
`

const ConnectedAutoComplete = graphql(getUsers, {
  skip: props => !props.filter,
  options: ({ filter }) => ({ variables: { search: filter } }),
  props: ({ data: { users = [] } }) => ({
    items: users.slice(0, 5).map(v => ({
      value: v,
      text: v.email
    }))
  })
})(Autocomplete)

class SearchUserForm extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      items: [],
      filter: '',
      value: null
    }
    this.filterChangeHandler = this.filterChangeHandler.bind(this)
    this.changeHandler = this.changeHandler.bind(this)
  }

  filterChangeHandler (value) {
    this.setState(() => ({
      ...this.state,
      filter: value
    }))
  }

  changeHandler (value) {
    this.setState(
      () => ({
        filter: null,
        value: null
      }),
      () => this.props.onChange(value)
    )
  }

  render () {
    const { filter, value } = this.state
    return (
      <ConnectedAutoComplete
        label={this.props.t(
          'metaData/field/authors',
          undefined,
          'Autor suchen'
        )}
        filter={filter}
        value={value}
        items={[]}
        onChange={this.changeHandler}
        onFilterChange={this.filterChangeHandler}
      />
    )
  }
}

export default withT(SearchUserForm)
