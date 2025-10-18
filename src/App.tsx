import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import { getTodos, createTodo, Todo } from "./components/services/todoService";
import { initGoogleCalendar, listEvents, CalendarEvent } from "./components/services/googleCalendar";
import { getRecipes, Recipe } from "./components/services/recipeAPI";

const App: React.FC = () => {
  const navigate = useNavigate(); // ✅ hook to programmatically navigate

  // --- Todos ---
  const [todos, setTodos] = useState<Todo[]>([]);
  useEffect(() => setTodos(getTodos()), []);

  const handleCreateTodo = () => {
    const content = window.prompt("Todo content");
    if (content) setTodos([createTodo(content), ...todos]);
  };

  // --- Google Calendar ---
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await initGoogleCalendar();
        const items = await listEvents();
        setEvents(items);
      } catch (err) {
        console.error("Google Calendar error:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // --- Recipes ---
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const res = await getRecipes(["chicken", "rice"]);
      setRecipes(res);
    } catch (err) {
      console.error("Recipe API error:", err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  // --- Helper ---
  const formatEventDate = (event: CalendarEvent) => {
    const dateStr = event.start.dateTime || event.start.date;
    return dateStr ? new Date(dateStr).toLocaleString() : "No date";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Navigation Button to Dashboard.jsx */}
      <button
        onClick={() => navigate("/dashboard")} // ✅ navigate to /dashboard route
        className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
      >
        Go to Dashboard Page
      </button>

      {/* Todos Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">My Todos</h2>
        <button
          onClick={handleCreateTodo}
          className="bg-green-500 text-white px-4 py-2 rounded mb-2"
        >
          + New Todo
        </button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
      </section>

      {/* Google Calendar Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upcoming Events</h2>
        {loadingEvents ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.summary}</strong> — {formatEventDate(event)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events found.</p>
        )}
      </section>

      {/* Recipes Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Recipe Suggestions</h2>
        <button
          onClick={fetchRecipes}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
          disabled={loadingRecipes}
        >
          {loadingRecipes ? "Loading..." : "Get Recipes"}
        </button>
        {recipes.length > 0 && (
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>{recipe.name}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default App;
