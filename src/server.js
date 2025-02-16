require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/database");
const schema = require("./graphql/schema");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

async function startApolloServer() {
  const apolloServer = new ApolloServer({
    schema,
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
    introspection: true,  
    playground: true,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at: https://comp3133-101413399-assignment1-1.onrender.com/graphql`);
  });
}

startApolloServer();
