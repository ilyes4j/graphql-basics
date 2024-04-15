import {GraphQLServer} from "graphql-yoga";
import {resolvers} from "./resolvers.js";

// Example usage:
const typeDefs = 'src/contract.graphql';

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start().then(() => console.log('The server is running !'));
