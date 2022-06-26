const express = require("express");
require("dotenv").config();
const {graphqlHTTP} = require("express-graphql");
const app = express();
const colors = require("colors");
const schema = require("./schema/schema");

const connect = require("./config/db");

connect();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`app listning on port ${port}`);
});
