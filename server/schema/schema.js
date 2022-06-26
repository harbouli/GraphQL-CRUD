// Mongoose Models

const Client = require("../models/Clients");
const Project = require("../models/Project");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
const Clients = require("../models/Clients");

// Client Type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    status: {type: GraphQLString},
    client: {
      type: ClientType,
      resolve: (parentValue, args) => Client.findById(parentValue.client.id),
    },
  }),
});

// Client Type
const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    phone: {type: GraphQLString},
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //   Project Query
    projects: {
      type: new GraphQLList(ProjectType),
      resolve: (parentValue, args) => Project.find(),
    },

    project: {
      type: ProjectType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => Project.findById(args.id),
    },

    // Client Query
    clients: {
      type: new GraphQLList(ClientType),
      resolve: (parentValue, args) => Client.find,
    },

    client: {
      type: ClientType,
      args: {id: {type: GraphQLID}},
      resolve: (parentValue, args) => Client.findById(args.id),
    },
  },
});

module.exports = new GraphQLSchema({query: RootQuery});
