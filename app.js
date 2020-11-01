const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

const isAuth = require('./middleware/is-auth');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.axe5q.mongodb.net:27017,cluster0-shard-00-01.axe5q.mongodb.net:27017,cluster0-shard-00-02.axe5q.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=atlas-tj3pv0-shard-0&authSource=admin&retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
