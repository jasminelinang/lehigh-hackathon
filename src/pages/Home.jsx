// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Amplify from "aws-amplify";
import awsExports from "../aws-exports";
import { initGoogleCalendar, listEvents } from "../services/googleCalendar";
import { getRecipes } from "../services/recipeAPI";

Amplify.configure(awsExports);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  // Load Google Calendar events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await initGoogleCalendar();
        const items = await listEvents();
        setEvents(items);
      } catch (err) {
        console.error("Error loading Google Calendar:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch sample recipes from AWS Lambda
  const fetchRecipes = async () => {
    setLoadingRecipes(true);
    try {
      const response = await getRecipes(["chicken", "rice"]);
      setRecipes(response);
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Upcoming Events</h2>
        {loadingEvents ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="mb-1">
                <strong>{event.summary}</strong> —{" "}
                {new Date(event.start.dateTime || event.start.date).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events found.</p>
        )}
      </section>

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

export default Home;
