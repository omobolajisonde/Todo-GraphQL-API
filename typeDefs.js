const { gql } = require("apollo-server-lambda");

// Construct a schema, using GraphQL schema language

const typeDefs = gql`
  type Todo {
    id: String
    title: String
    description: String
    completed: Boolean
  }

  input todoInfo {
    title: String!
    description: String
  }

  input editTodoInfo {
    title: String
    description: String
    completed: Boolean
  }

  type Query {
    getTodo(id: String!): Todo
    getTodos: [Todo]
  }

  type Mutation {
    createTodo(todo: todoInfo!): Todo
    updateTodo(id: String!, update: editTodoInfo): Todo
    deleteTodo(id: String!): String
  }
`;

module.exports = typeDefs;
