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

  // State
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [groceryList, setGroceryList] = useState<string[]>(["Milk", "Eggs", "Chicken", "Rice"]);
  const [newGrocery, setNewGrocery] = useState<string>("");

  // Google API credentials
  const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
  const API_KEY = "YOUR_GOOGLE_API_KEY";
  const SCOPES = "https://www.googleapis.com/auth/calendar.events";

  // Initialize Google API
  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          if (authInstance.isSignedIn.get()) {
            listUpcomingEvents();
          } else {
            navigate("/"); // redirect to sign-up if not signed in
          }
        });
    });
  }, []);

  // Fetch Google Calendar events
  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 50,
        orderBy: "startTime",
      })
      .then((response: any) => {
        const items: CalendarEvent[] = response.result.items.map((event: any) => ({
          id: event.id,
          summary: event.summary,
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
        }));

        // Filter events for this week (Sunday → Saturday)
        const now = new Date();
        const sunday = new Date(now);
        sunday.setDate(now.getDate() - now.getDay());
        sunday.setHours(0, 0, 0, 0);

        const saturday = new Date(sunday);
        saturday.setDate(sunday.getDate() + 6);
        saturday.setHours(23, 59, 59, 999);

        const weekEvents = items.filter(
          (e: CalendarEvent) => e.start >= sunday && e.start <= saturday
        );

        setEvents(weekEvents);
      });
  };

  // Handle input change (TypeScript-safe)
  const handleGroceryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrocery(e.target.value);
  };

  // Add grocery item
  const addGroceryItem = () => {
    if (newGrocery.trim() !== "") {
      setGroceryList([...groceryList, newGrocery.trim()]);
      setNewGrocery("");
    }
  };

  // Weekday helper
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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h1 className="text-3xl font-bold mb-4">Ejenda</h1>
        <p>Welcome back!</p>
        <button
          onClick={() => gapi.auth2.getAuthInstance().signOut().then(() => navigate("/"))}
          className="mt-4 bg-red-500 text-white px-3 py-1 rounded"
        >
          Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="motivational-quote">
          Today's Affirmation: I am capable of achieving my goals.
        </div>

        {/* Weekly Calendar */}
        <div className="weekly-calendar">
          <h2>This Week's Calendar</h2>
          <div className="week-grid">
            {datesOfWeek.map((date, idx) => (
              <div key={idx} className="day-column">
                <strong>
                  {weekDays[date.getDay()]} ({date.getMonth() + 1}/{date.getDate()})
                </strong>
                <ul>
                  {events
                    .filter((event) => event.start.getDay() === date.getDay())
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map((event) => (
                      <li key={event.id}>
                        {event.start.getHours().toString().padStart(2, "0")}:
                        {event.start.getMinutes().toString().padStart(2, "0")} - {event.summary}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Grocery List */}
        <div className="grocery-list">
          <h2>Grocery List:</h2>
          <ul>
            {groceryList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <input
            type="text"
            value={newGrocery}
            placeholder="Add item..."
            onChange={handleGroceryChange}
          />
          <button onClick={addGroceryItem}>Add</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
