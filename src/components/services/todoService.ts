import todosData from "../../data/todos.json";

export type Todo = {
  id: string;
  content: string;
};

// Local in-memory copy
let todos: Todo[] = [...todosData];

export const getTodos = (): Todo[] => {
  return todos;
};

export const createTodo = (content: string): Todo => {
  const newTodo: Todo = {
    id: (Math.random() * 1000000).toFixed(0),
    content,
  };
  todos = [newTodo, ...todos];
  return newTodo;
};
