
import axios from "axios";
import e from "cors";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';


export default function App() {
  const BASE_URL = "http://localhost:5002";

  const [todos, setTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Add this line



  const [currentTodo, setCurrentTodo] = useState({ id: null, value: "" });

  const getTodo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/todos`);
      setTodos(res?.data?.data || []);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (event) => {
    event.preventDefault();
    const todoValue = event.target.todoInput.value.trim();

    if (!todoValue) {
      alert("Please enter a valid task.");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/v1/todo`, { todo: todoValue });
      event.target.reset();
      getTodo();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      console.log("todoId ", todoId);

      const res = await axios.delete(`${BASE_URL}/api/v1/todo/${todoId}`);

      console.log("data ", res.data);

      toast(res.data?.message);

      getTodo();
    } catch (err) {
      console.log("mera error", err);

      toast.error(err?.response?.data?.message || "unknown errorrr");
    }
  };

  const startEditing = (id, value) => {
    setIsEditing(true);
    setCurrentTodo({ id, value });
  };
  const saveEdit = async (event) => {
    event.preventDefault();
    const newValue = event.target.editInput.value.trim();

    if (!newValue) {
      alert("Please enter a valid task.");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/v1/todo/${currentTodo.id}`, { todo: newValue });
      setIsEditing(false);
      setCurrentTodo({ id: null, value: "" });
      getTodo();
    } catch (err) {
      console.error("Error editing todo:", err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br    flex items-center justify-center">
      <div className="bg-white p-8 rounded-[8px] shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400  mb-8">
          Todo-App
        </h1>

        {isEditing ? (
          <form onSubmit={saveEdit} className="mb-6">
            <input
              type="text"
              name="editInput"
              defaultValue={currentTodo.value}
              className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-red-300"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-xl shadow-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 mt-4 transition-all"
            >
              Save
            </button>
          </form>
        ) : (
          <form onSubmit={addTodo} className="mb-6">
            <input
              type="text"
              name="todoInput"
              placeholder="Enter your task"
              className="w-full p-4 border border-gray-300 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-red-300"
            />
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-xl shadow-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 mt-4 transition-all"
            >
              Add Task 
            </button>
          </form>
        )}

        {/* {!todos.length && "todo nhi hy"} */}

        <ul className="mt-6 space-y-4">
          {todos?.map((todo, index) => (
            <li
              key={todo._id}
              className="flex justify-between items-center p-4"
            >
              {!todo.isEditing ? (
                <span className="text-gray-700">{todo.todoContent}</span>
              ) : (
                <input
                  type="text"
                  value={todo.todoContent}
                  onChange={(e) => {
                    const newTodos = [...todos];
                    newTodos[index].todoContent = e.target.value;
                    setTodos(newTodos);
                  }}
                  className="border border-gray-400"
                />
              )}
              <div className="space-x-3">
                {!todo.isEditing ? (
                  <button
                    onClick={() => {
                      const newTodos = todos.map((todo, i) => {
                        todo.isEditing = true;
                        return todo;
                      });
                      setTodos([...newTodos]);
                    }}
                    className="px-4 py-2  text-blue-700 rounded-lg shadow-md hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const newTodos = todos.map((todo, i) => {
                        todo.isEditing = false;
                        return todo;
                      });
                      setTodos([...newTodos]);
                    }}
                  >
                    cancel
                  </button>
                )}
                {!todo.isEditing ? (
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="px-4 py-2 text-red-600  rounded-lg shadow-md hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                  >
                    Delete
                  </button>
                ) : (
                  <button

                    onClick={() => {
                      const newTodos = todos.map((t, i) =>
                        i === index
                          ? { ...t, isEditing: false }
                          : t
                      );
                      setTodos(newTodos);
                    }}

                  >Save</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}











