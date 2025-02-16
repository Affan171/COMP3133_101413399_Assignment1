// const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/database');
// const typeDefs = require('./graphql/typeDefs');
// const resolvers = require('./graphql/resolvers');

// dotenv.config();

// // Connect to MongoDB
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Initialize Apollo Server
// const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     context: ({ req }) => {
//         const user = authMiddleware(req); // Extract userId from token
//         return { req, user };
//     },
// });

// async function startServer() {
//     await server.start();
//     server.applyMiddleware({ app });

//     const PORT = process.env.PORT || 4000;
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
//     });
// }

// startServer();


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const schema = require("./graphql/schema");  // Import our combined schema

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

async function startApolloServer() {
  const apolloServer = new ApolloServer({
    schema,  // now we just pass in the merged schema
    context: ({ req }) => {
      const authHeader = req.headers.authorization || "";
      let user = null;
      if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        try {
          user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
          console.warn("Invalid token:", err.message);
        }
      }
      return { user };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
