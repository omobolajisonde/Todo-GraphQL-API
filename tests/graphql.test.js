const { graphql } = require("graphql");
require("dotenv").config();
const mongoose = require("mongoose");
const Todo = require("../models/todoModel");
const { makeExecutableSchema } = require("graphql-tools");
const resolvers = require("./../resolvers");
const typeDefs = require("./../typeDefs");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let todoId;

beforeAll(async () => {
  try {
    const TEST_DATABASE_URI =
      process.env.TEST_DATABASE_URI || "mongodb://localhost:27017/todoAPI-test";
    await mongoose.connect(TEST_DATABASE_URI);
    const mock = {
      title: "Complete the Mid Level Back-End Developer Task.",
      description:
        "Develop a GraphQL API for a to-do list application using MongoDB and AWS Lambda.",
    };
    const mockTodo = await Todo.create(mock);
    todoId = mockTodo._id;
  } catch (error) {
    console.log(error.message);
  }
});

afterAll(async () => {
  try {
    await Todo.deleteMany({});
    await mongoose.disconnect();
  } catch (error) {
    console.log(error.message);
  }
});

describe("GraphQL queries and mutations", () => {
  // Create Op test
  it("createTodo mutation should create a Todo and return a Todo object", async () => {
    const mutation = `
      mutation($todo: todoInfo!) {
        createTodo(todo: $todo){id, title, description, completed}
      }
    `;

    const variables = {
      todo: {
        title: "Complete the Mid Level Back-End Developer Task.",
        description:
          "Develop a GraphQL API for a to-do list application using MongoDB and AWS Lambda.",
      },
    };

    const result = await graphql(schema, mutation, null, null, variables);
    const { createTodo: res } = result.data;
    expect(res.completed).toEqual(false);
    expect(res).toHaveProperty("id");
  });

  // Read Ops test
  it("getTodos query should return an array of Todo objects", async () => {
    const query = `
      query {
        getTodos{id, title, description, completed}
      }
    `;

    const result = await graphql(schema, query);
    const { getTodos: res } = result.data;
    expect(res).not.toHaveLength(0);
  });

  it("getTodo query should return a Todo object", async () => {
    const query = `
      query($id: String!) {
        getTodo(id: $id){id, title, description, completed}
      }
    `;

    const variables = {
      id: todoId.toString(),
    };

    const result = await graphql(schema, query, null, null, variables);
    const { getTodo: res } = result.data;
    expect(res.id).toEqual(variables.id);
    expect(res).toHaveProperty("completed");
  });
});

// Update Op test
it("updateTodo mutation should apply update to Todo and return an updated Todo object", async () => {
  const mutation = `
      mutation($id: String!, $update:editTodoInfo) {
        updateTodo(id: $id, update:$update){id, title, description, completed}
      }
    `;

  const variables = {
    id: todoId.toString(),
    update: {
      completed: true,
    },
  };

  const result = await graphql(schema, mutation, null, null, variables);
  const { updateTodo: res } = result.data;
  expect(res.completed).toEqual(true);
});

// Delete Op test
it("deleteTodo mutation should delete Todo and return a confirmation message.", async () => {
  const mutation = `
      mutation($id: String!) {
        deleteTodo(id: $id)
      }
    `;

  const variables = {
    id: todoId.toString(),
  };

  const result = await graphql(schema, mutation, null, null, variables);
  const { deleteTodo: res } = result.data;
  expect(res).toEqual("Successfully deleted!");
});
