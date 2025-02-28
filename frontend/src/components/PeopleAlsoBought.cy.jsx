import React from 'react'
import PeopleAlsoBought from './PeopleAlsoBought'

describe('<PeopleAlsoBought />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<PeopleAlsoBought />)
  })
})