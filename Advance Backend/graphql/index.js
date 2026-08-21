import express from "express"
import {ApolloServer} from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5';
import bodyParser from 'body-parser'
import cors from 'cors'
import axios from "axios";

async function startServer() {
    const app = express();
    const typeDefs = `
    type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    phone: String!
    website: String!
    }

    type Todo {
    id: ID!
    title: String
    completed: Boolean 
    }

    type Query {
    getTodos: [Todo]
    getUsers: [User]
    }
    `
    const resolvers = {
        Query:{
            getTodos: async ()=> (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,

            getUsers: async ()=> (await axios.get("https://jsonplaceholder.typicode.com/users")).data
        }
    }
    const server = new ApolloServer({typeDefs, resolvers})
    await server.start()
    app.use(bodyParser.json());
    app.use(cors());
    app.use("/graphql", expressMiddleware(server))
    app.listen(3000, ()=>{
        console.log(`Server is running on port http://loaclhost:3000/graphql`)
    })
}

startServer()