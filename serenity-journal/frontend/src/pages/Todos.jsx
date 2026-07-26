import { useEffect, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "../components/AppLayout";
import api from "../utils/api";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    api.get("/todos").then(({ data }) => setTodos(data));
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post("/todos", { text });
    setTodos((prev) => [data, ...prev]);
    setText("");
  };

  const toggleTodo = async (todo) => {
    const { data } = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    setTodos((prev) => prev.map((t) => (t._id === data._id ? data : t)));
  };

  const deleteTodo = async (todo) => {
    await api.delete(`/todos/${todo._id}`);
    setTodos((prev) => prev.filter((t) => t._id !== todo._id));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <AppLayout>
      <h1 className="font-display text-3xl mb-2">Daily goals</h1>
      <p className="opacity-60 mb-6 text-sm">
        {completedCount} of {todos.length} done today
      </p>

      <form onSubmit={addTodo} className="glass-card p-3 flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What would you like to accomplish today?"
          className="flex-1 bg-transparent outline-none px-3"
        />
        <button className="accent-bg text-white px-4 py-2 rounded-xl flex items-center gap-1">
          <FiPlus /> Add
        </button>
      </form>

      <div className="glass-card p-2">
        <AnimatePresence>
          {todos.map((todo) => (
            <motion.div
              key={todo._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3 px-4 py-3 border-b border-black/5 last:border-0"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              <span className={`flex-1 ${todo.completed ? "line-through opacity-50" : ""}`}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo)}
                className="opacity-40 hover:text-red-500 hover:opacity-100"
              >
                <FiTrash2 />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {todos.length === 0 && (
          <p className="opacity-60 text-sm text-center py-6">
            No goals yet — add your first one above.
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default Todos;
