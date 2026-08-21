import express from "express"
import {ApolloServer} from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5';
import bodyParser from 'body-parser'
import cors from 'cors'

async function startServer() {
    const app = express();
    const typeDefs = `
    type Query{
    hello:String
    name:String
    }
    `
    const resolvers = {
        Query:{
            hello:()=>"Hello World",
            name:()=>"Neeraj"
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