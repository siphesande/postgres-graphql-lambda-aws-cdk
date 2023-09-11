import "reflect-metadata"
import { ApolloServer, BaseContext } from "@apollo/server";
import { createConnection } from 'typeorm';
import { Task } from './task.entity';

const connectToDatabase = async () => {
    try {
      const connection = await createConnection();
      console.log('Connected to the database');
      return connection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      throw error;
    }
  };
  
export const dbConnection = connectToDatabase();

const typeDefs = `
type Query {
  tasks: [Task]
}

type Task {
  id: Int
  title: String
  completed: Boolean
}

type Mutation {
  createTask(title: String!): Task
  updateTask(id: Int!, title: String!): Task
  deleteTask(id: Int!): Boolean
  markTaskAsCompleted(id: Int!): Task
}
`;


const resolvers = {
    Query: {
      tasks: async () => {
        try {
          const tasks = await Task.find();
          return tasks;
        } catch (error) {
          console.error('Error fetching tasks:', error);
          throw error;
        }
      },
    },
    Mutation: {
        createTask: async (_: any, { title }: { title: string }) => {
          try {
            const task = new Task();
            task.title = title;
            await task.save();
            return task;
          } catch (error) {
            console.error('Error creating a task:', error);
            throw error;
          }
        },
        updateTask: async (_: any, { id, title }: { id: number; title: string }) => {
            try {
              const task = await Task.findOne({ where: { id } });
              if (!task) {
                throw new Error('Task not found');
              }
              task.title = title;
              await task.save();
              return task;
            } catch (error) {
              console.error('Error updating a task:', error);
              throw error;
            }
        },
        deleteTask: async (_: any, { id }: { id: number }) => {
          try {
            await Task.delete(id);
            return true;
          } catch (error) {
            console.error('Error deleting a task:', error);
            throw error;
          }
        },
        markTaskAsCompleted: async (_: any, { id }: { id: number }) => {
          try {
            const task = await Task.findOne({ where: { id } });
            if (!task) {
              throw new Error('Task not found');
            }
            task.completed = true;
            await task.save();
    
            return task;
          } catch (error) {
            console.error('Error marking a task as completed:', error);
            throw error;
          }
        },
      },
    
  };
 

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'prod'
});

function bootstrapContext(): Promise<BaseContext> {
    return Promise.resolve({
        number: 41
    });
}


const options: any = bootstrapContext().then(context => {
    return context;
});

export { server, options }