export type CalendarEvent = {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
};

export const initGoogleCalendar = async (): Promise<void> => {
  // Placeholder for initialization
  return;
};

export const listEvents = async (): Promise<CalendarEvent[]> => {
  // Mock some events
  return [
    {
      id: "1",
      summary: "Meeting with Bob",
      start: { dateTime: new Date().toISOString() },
    },
    {
      id: "2",
      summary: "Gym",
      start: { dateTime: new Date(Date.now() + 3600000).toISOString() }, // 1h later
    },
  ];
};
