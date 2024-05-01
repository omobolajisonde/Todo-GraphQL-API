const Todo = require("./models/todoModel");
const catchAsync = require("./utils/catchAsync");

const resolvers = {
  Query: {
    // Read Ops
    getTodo: catchAsync(async (_parent, args) => {
      const todo = await Todo.findById(args.id);
      if (!todo) throw new Error("Todo not found!");
      return todo;
    }),
    getTodos: catchAsync(async () => {
      const todos = await Todo.find({});
      return todos;
    }),
  },
  Mutation: {
    // Create Op
    createTodo: catchAsync(async (_parent, args) => {
      const { title, description } = args.todo;
      const todo = await Todo.create({ title, description });
      return todo;
    }),
    // Update Op
    updateTodo: catchAsync(async (_parent, args) => {
      const updatedTodo = await Todo.findByIdAndUpdate(args.id, args.update, {
        new: true,
      });
      if (!updatedTodo) throw new Error("Todo not found!");
      return updatedTodo;
    }),
    // Delete Op
    deleteTodo: catchAsync(async (_parent, args) => {
      const todo = await Todo.findByIdAndDelete(args.id);
      if (!todo) throw new Error("Todo not found!");
      return "Successfully deleted!";
    }),
  },
};

module.exports = resolvers;
