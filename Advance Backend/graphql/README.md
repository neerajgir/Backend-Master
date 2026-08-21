# GraphQL Learning Repository

## 📖 Introduction (परिचय)

GraphQL is a query language for APIs that allows clients to request exactly what they need. Unlike REST where you get fixed endpoints, GraphQL gives you a single endpoint and clients specify their data requirements.

### Basic Concepts (मूल अवधारणाएं)

- **Schema (स्कीमा)**: Defines types and relationships using GraphQL Schema Definition Language (SDL)
- **Query (प्रश्न)**: Read operation - fetches data
- **Mutation (म्यूटेशन)**: Write operation - creates/updates/deletes data
- **Resolver (रिज़ॉल्वर)**: Functions that fetch data for each field in the schema
- **Client**: Sends queries/mutations to the server

### Why GraphQL? (क्यों GraphQL?)

| Problem in REST | GraphQL Solution |
|----------------|------------------|
| Multiple endpoints for different resources | Single endpoint `/graphql` |
| Over-fetching (getting extra data) | Clients request only what they need |
| Under-fetching (making multiple requests) | One request gets all needed data |
| Versioning complexity | Evolve schema without breaking changes |

## 🚀 Quick Start (त्वरित शुरू)

```bash
# Install dependencies
npm install

# Run the server
npm run dev
```

The server runs on `http://localhost:3000/graphql`

## 📐 Schema Definition (स्कीमा परिभाषा)

GraphQL uses Schema Definition Language (SDL) to define types:

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  phone: String!
}

type Todo {
  id: ID!
  title: String
  completed: Boolean
  user: User
}

type Query {
  getTodos: [Todo]
  getUsers: [User]
  getUserById(id: ID!): User
}

type Mutation {
  createTodo(title: String!, userId: ID!): Todo
}
```

**Key SDL Features:**
- `!` denotes non-nullable fields
- `[Todo!]!` means non-nullable array of non-nullable Todo
- Arguments can be passed: `getUserById(id: ID!)`

## 🔍 Queries (प्रश्न)

### Basic Query (बुनियादी प्रश्न)

```graphql
query {
  getUsers {
    id
    name
    email
  }
}
```

### Query with Variables (चर के साथ प्रश्न)

```graphql
query getUsers($limit: Int!) {
  getUsers(limit: $limit) {
    id
    name
  }
}
```

**Variables (चर):**
```json
{
  "limit": 10
}
```

### Nested Queries (एनक्वेर्ड प्रश्न)

```graphql
query {
  getUserById(id: "1") {
    id
    name
    todo {
      title
      completed
    }
  }
}
```

## ✏️ Mutations (म्यूटेशन)

### Basic Mutation (बुनियादी म्यूटेशन)

```graphql
mutation {
  createTodo(title: "Learn GraphQL", userId: "1") {
    id
    title
    completed
  }
}
```

### Mutation with Input Type (इनपुट प्रकार के साथ म्यूटेशन)

```graphql
input CreateTodoInput {
  title: String!
  userId: ID!
  completed: Boolean
}

mutation {
  createTodo(input: CreateTodoInput!) {
    id
    title
    completed
  }
}
```

## 🧠 Deep Knowledge (गहरी जानकारी)

### Resolver Structure (रिज़ॉल्वर संरचना)

```javascript
const resolvers = {
  Query: {
    getTodos: async () => {
      // Fetch data from database or external API
      const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
      return response.data;
    },
    
    getUserById: async (_, { id }) => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
      return response.data;
    }
  },
  
  Mutation: {
    createTodo: async (_, { title, userId }) => {
      const response = await axios.post(
        'https://jsonplaceholder.typicode.com/todos',
        { title, userId, completed: false }
      );
      return response.data;
    }
  }
};
```

### Resolver with Context (संदर्भ के साथ रिज़ॉल्वर)

```javascript
const resolvers = {
  Query: {
    getTodos: async (_, __, { auth }) => {
      // Access authentication context
      if (!auth.isAuthenticated) {
        throw new Error('Unauthorized');
      }
      return axios.get('https://jsonplaceholder.typicode.com/todos');
    }
  }
};
```

### Apollo Server Setup (एपोलो सर्वर सेटअप)

```javascript
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

async function startServer() {
  const app = express();
  
  const typeDefs = `...`; // Your schema here
  const resolvers = { ... }; // Your resolvers here
  
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });
  
  await server.start();
  
  app.use(bodyParser.json());
  app.use(cors());
  app.use('/graphql', expressMiddleware(server));
  
  app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/graphql');
  });
}

startServer();
```

## 📦 Other Topics (अन्य विषय)

### 1. Fragment (फ़्रैगमेंट)

```graphql
fragment userDetails on User {
  id
  name
  email
}

query {
  getUsers {
    ...userDetails
    phone
  }
}
```

### 2. Aliases (एलियास)

```graphql
query {
  getTodo1: getTodo(title: "Learn") {
    title
  }
  getTodo2: getTodo(title: "GraphQL") {
    title
  }
}
```

### 3. Directives (डायरेक्टिव्स)

```graphql
type Todo @auth(required: true) {
  id: ID!
  title: String
}

# Usage with @skip and @include
query {
  getTodos @include(if: true) {
    title
  }
}
```

### 4. Interfaces (इंटरफेसेस)

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

type Todo implements Node {
  id: ID!
  title: String
}

query {
  node(id: "1") {
    ... on User {
      name
    }
    ... on Todo {
      title
    }
  }
}
```

### 5. Unions (यूनियन्स)

```graphql
union SearchResult = User | Todo | String

type Query {
  search(text: String!): SearchResult
}
```

### 6. Enums (एनम्स)

```graphql
enum Role {
  ADMIN
  USER
  GUEST
}

type User {
  role: Role!
}
```

### 7. Custom Scalars (कस्टम स्केलर्स)

```graphql
scalar DateTime

type Query {
  getEvent(date: DateTime!): Event
}
```

### 8. Nested Mutations (एनक्वेर्ड म्यूटेशन)

```graphql
mutation {
  createTodo(title: "Learn") {
    id
    title
    user {
      name
    }
  }
}
```

### 9. Pagination (पेजिनेशन)

```graphql
type PaginationInfo {
  total: Int!
  page: Int!
  perPage: Int!
  hasMore: Boolean!
}

type Query {
  getTodos(pagination: PaginationInput!): {
    todos: [Todo]
    pagination: PaginationInfo
  }
}
```

### 10. Real-time (रीयल-टाइम)

Using Subscriptions:

```graphql
type Mutation {
  toggleTodo(id: ID!): Todo
}

type Subscription {
  todoUpdated: Todo
}

subscription {
  todoUpdated {
    id
    title
    completed
  }
}
```

## 🛠️ Commonly Used Packages (आमतौर पर इस्तेमाल किए जाने वाले पैकेजेस)

| Package | Purpose |
|---------|---------|
| `@apollo/server` | Core Apollo Server |
| `graphql` | GraphQL execution |
| `@as-integrations/express5` | Express integration |
| `express` | Web server |
| `cors` | Cross-origin resource sharing |
| `body-parser` | Parse JSON bodies |
| `axios` | HTTP client for API calls |

## 📚 Learning Resources (सीखने के संसाधन)

- **GraphQL Official Docs**: https://graphql.org/learn/
- **Apollo Documentation**: https://www.apollographql.com/docs/
- **How to GraphQL**: https://www.howtographql.com/
- **GraphQL India Community**: Various meetups and tutorials

## 🤝 Contributing (योगदान)

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AwesomeFeature`)
3. Commit your changes (`git commit -m 'Add some AwesomeFeature'`)
4. Push to the branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

## 📜 License (लाइसेंस)

This project is licensed under the ISC License.

---

**Made with ❤️ for learning GraphQL**

*Hindi (Hinglish) explanation: GraphQL ek API query language hai jo clients ko exact data maangne ka power deta hai. REST APIs fixed endpoints use karte hain lekin GraphQL ek single endpoint provide karta hai jahan client apne according data specify kar sakta hai.*