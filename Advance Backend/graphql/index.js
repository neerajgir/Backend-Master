import express from "express"
import {ApolloServer} from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5';
import bodyParser from 'body-parser'
import cors from 'cors'

async function startServer() {
    const app = express();
    


    app.listen(3000, ()=>{
        console.log("Server is running on port 3000")
    })
}

startServer()