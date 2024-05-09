require("dotenv").config();
const { ApolloServer } = require("apollo-server-lambda");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const connectToDB = require("./db");

(async () => {
  try {
    await connectToDB();
    console.log("Successfully connected to DB.");
  } catch (error) {
    console.log("🤦‍♂️ Oops something went terribly wrong.", error.message);
  }
})();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  persistedQueries: false,
});

exports.handler = apolloServer.createHandler();
