import { startStandaloneServer } from "@apollo/server/standalone";
import { server } from './app';

const { url } = await startStandaloneServer(server);
console.log(`Server ready at ${url}`);