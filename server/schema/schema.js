// Mongoose Models

const Client = require("../models/Clients");
const Project = require("../models/Project");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
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
      resolve: (parentValue, args) => Client.findById(parentValue.clientId),
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

// Mutations

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // Post
    addClient: {
      type: ClientType,
      args: {
        name: {type: GraphQLString},
        phone: {type: GraphQLString},
        email: {type: GraphQLString},
      },
      resolve: (parentValue, args) => {
        const client = new Client({
          email: args.email,
          name: args.name,
          phone: args.phone,
        });
        return client.save();
      },
    },
    // Delete
    deleteClient: {
      type: ClientType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: (parentValue, args) => Client.findByIdAndRemove(args.id),
    },
    // Add Project\
    addProject: {
      type: ProjectType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        description: {type: new GraphQLNonNull(GraphQLString)},
        status: {
          type: new GraphQLEnumType({
            name: "projectStatus",
            values: {
              new: {value: "Not Working"},
              progress: {value: "In Progress"},
              done: {value: "Completed"},
            },
          }),
          defaultValue: "In Progress",
        },
        clientId: {type: new GraphQLNonNull(GraphQLID)},
      },
      resolve: (parentValue, args) => {
        const project = new Project({
          name: args.name,
          clientId: args.clientId,
          description: args.description,
          status: args.status,
        });
        return project.save();
      },
    },
    // Delete Project
    deleteProject: {
      type: ProjectType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve: (parentValue, args) => {
        return Project.findByIdAndRemove(args.id);
      },
    },
    // Update Project
    updateProject: {
      type: ProjectType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        name: {type: GraphQLString},
        clientId: {type: GraphQLID},
        description: {type: GraphQLString},
        status: {
          type: new GraphQLEnumType({
            name: "projectStatusUpdated",
            values: {
              new: {value: "Not Working"},
              progress: {value: "In Progress"},
              done: {value: "Completed"},
            },
          }),
          defaultValue: "In Progress",
        },
      },
      resolve: (parentValue, args) => {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              clientId: args.clientId,
              description: args.description,
              name: args.name,
              status: args.status,
            },
          },
          {new: true}
        );
      },
    },
  },
});

module.exports = new GraphQLSchema({query: RootQuery, mutation});
