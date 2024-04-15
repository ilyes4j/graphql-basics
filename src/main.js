import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers.js";
// Example usage:
const filePath = 'src/contract.graphql';
afterLoadFile(filePath);
function afterLoadFile(typeDefs) {
    const server = new GraphQLServer({
        typeDefs,
        resolvers
    });
    server.start().then(() => console.log('The server is running !'));
}
