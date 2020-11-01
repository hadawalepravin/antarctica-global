const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
  _id: ID!
  firstName: String!
  lastName: String!
  email: String!
  password: String
}

input UserInput {
  firstName: String!
  lastName: String!
  email: String!
  password: String!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type Organization {
  _id: ID!
  name: String!
  location: String!
}

input OrganizationInput {
  name: String!
  location: String!
}

type Registration {
  _id: ID!
  organization: Organization!
  user: User!
  employeeId: String!
  createdAt: String!
  updatedAt: String!
}

input RegistrationInput {
  userId: String!
  organizationId: String!
}

input FilterInput {
  firstName: String
  lastName: String
  employeeId: String
  sortInput: SortInput
  paginationInput: PaginationInput
}

input SortInput {
  field: String
  order: Int
}

input PaginationInput {
  size: Int
  index: Int
}

type RootQuery {
  login(email: String!, password: String!): AuthData!
  users: [User!]!
  organizations: [Organization!]!
  registrations: [Registration!]!
  filterRegistrations(filterInput: FilterInput): [Registration!]!
}

type RootMutation {
  createUser(userInput: UserInput): User
  createOrganization(organizationInput: OrganizationInput): Organization
  register(registrationInput: RegistrationInput): Registration!
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);
