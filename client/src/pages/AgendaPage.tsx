import { useEffect, useState } from "react";
import "../styles/Agenda.css";
import "../styles/User.css";
import { nanoid } from "nanoid";
import AgendaEvent from "../components/AgendaEvent";
import AgendaAdd from "../components/AgendaAdd";
import { type EventFromDB, EventSetting } from "../types/events";

function AgendaPage() {
  const [events, setEvents] = useState<EventSetting[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data.map(
            (item: EventFromDB) =>
              new EventSetting(
                item.id,
                item.subject,
                new Date(item.start_time),
                new Date(item.end_time),
                item.description,
                item.location,
                item.color,
              ),
          ) as EventSetting[],
        );
      });
  }, []);

  return (
    <div className="agenda-container">
      <section>
        <h2>Agenda</h2>
      </section>
      <div className="agenda-events-container">
        {events.map((event) => (
          <AgendaEvent key={nanoid()} event={event} />
        ))}
        <AgendaAdd events={events} setEvents={setEvents} />
      </div>
    </div>
  );
}

export default AgendaPage;
