import Todo from "../models/Todo.js";

export const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req, res, next) => {
  try {
    const { text, date } = req.body;
    if (!text) {
      res.status(400);
      throw new Error("Task text is required");
    }
    const todo = await Todo.create({ user: req.user._id, text, date });
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      res.status(404);
      throw new Error("Task not found");
    }
    Object.assign(todo, req.body);
    await todo.save();
    res.json(todo);
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      res.status(404);
      throw new Error("Task not found");
    }
    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
