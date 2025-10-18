import React, { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // ---------- STATE ----------
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [groceryList, setGroceryList] = useState<string[]>([
    "Milk",
    "Eggs",
    "Chicken",
    "Rice",
  ]);
  const [newGrocery, setNewGrocery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- GOOGLE API CONFIG ----------
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID!;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY!;
  const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

  // ---------- INITIALIZE GOOGLE CLIENT ----------
  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
          ],
          scope: SCOPES,
        })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          if (auth.isSignedIn.get()) {
            listUpcomingEvents();
          } else {
            // If user is not logged in, redirect to sign-up
            navigate("/");
          }
        })
        .catch((err: any) => {
          console.error("Google API init error:", err);
          setError("Failed to initialize Google Calendar");
        })
        .finally(() => setLoading(false));
    }

    gapi.load("client:auth2", initClient);
  }, []);

  // ---------- FETCH EVENTS ----------
  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 20,
        orderBy: "startTime",
      })
      .then((response: any) => {
        const items: CalendarEvent[] = response.result.items.map(
          (event: any) => ({
            id: event.id,
            summary: event.summary || "No title",
            start: new Date(event.start.dateTime || event.start.date),
            end: new Date(event.end.dateTime || event.end.date),
          })
        );
        setEvents(items);
      })
      .catch((err: any) => {
        console.error("Error loading events:", err);
        setError("Error loading calendar events");
      });
  };

  // ---------- GROCERIES ----------
  const handleGroceryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrocery(e.target.value);
  };

  const addGroceryItem = () => {
    if (newGrocery.trim() !== "") {
      setGroceryList((prev) => [...prev, newGrocery.trim()]);
      setNewGrocery("");
    }
  };

  const removeGroceryItem = (idx: number) => {
    setGroceryList((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---------- WEEKDAY CALENDAR ----------
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDatesOfWeek = (): Date[] => {
    const dates: Date[] = [];
    const now = new Date();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - now.getDay());
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const datesOfWeek = getDatesOfWeek();

  // ---------- RENDER ----------
  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h1 className="text-3xl font-bold mb-4">Ejenda</h1>
        <p>Welcome back!</p>
        <button
          onClick={() =>
            gapi.auth2
              .getAuthInstance()
              .signOut()
              .then(() => navigate("/"))
          }
          className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <div className="motivational-quote mb-4">
          🌟 Today’s Affirmation: <strong>I am capable of achieving my goals.</strong>
        </div>

        {/* Weekly Calendar */}
        <section className="weekly-calendar mb-6">
          <h2 className="text-2xl font-semibold mb-2">This Week’s Calendar</h2>
          <div className="week-grid">
            {datesOfWeek.map((date, idx) => (
              <div key={idx} className="day-column">
                <strong>
                  {weekDays[date.getDay()]} ({date.getMonth() + 1}/{date.getDate()})
                </strong>
                <ul>
                  {events
                    .filter((event) => event.start.getDay() === date.getDay())
                    .map((event) => (
                      <li key={event.id} className="event-item">
                        {event.start.getHours().toString().padStart(2, "0")}:
                        {event.start.getMinutes().toString().padStart(2, "0")} —{" "}
                        {event.summary}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Grocery List */}
        <section className="grocery-list">
          <h2 className="text-2xl font-semibold mb-2">🛒 Grocery List</h2>
          <ul className="mb-3">
            {groceryList.map((item, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>{item}</span>
                <button
                  onClick={() => removeGroceryItem(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGrocery}
              placeholder="Add item..."
              onChange={handleGroceryChange}
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              onClick={addGroceryItem}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
            >
              Add
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
