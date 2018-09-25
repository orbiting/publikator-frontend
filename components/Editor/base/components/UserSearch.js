import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Autocomplete } from '@project-r/styleguide'
import gql from 'graphql-tag'

export const GET_USERS = gql`
  query getUsers($search: String!) {
    users(search: $search) {
      firstName
      lastName
      email
      id
    }
  }
`

const ConnectedAutoComplete = graphql(GET_USERS, {
  skip: props => !props.filter,
  options: ({ filter }) => ({
    variables: { search: filter }
  }),
  props: ({ data: { users = [] } }) => ({
    items: users.slice(0, 5).map(v => ({
      value: v,
      text: v.email
    }))
  })
})(Autocomplete)

export default class UserSearch extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      items: [],
      filter: '',
      value: null
    }
    this.filterChangeHandler = this.filterChangeHandler.bind(
      this
    )
    this.changeHandler = this.changeHandler.bind(
      this
    )
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
    const { filter, value, label } = this.state
    return (
      <ConnectedAutoComplete
        label={label}
        filter={filter}
        value={value}
        items={[]}
        onChange={this.changeHandler}
        onFilterChange={this.filterChangeHandler}
      />
    )
  }
}
