import { useEffect, useState } from "react";
import "../styles/Agenda.css";
import "../styles/User.css";
import { nanoid } from "nanoid";
import AgendaEvent from "../components/AgendaEvent";
import AgendaAdd from "../components/AgendaAdd";
import { type EventFromDB, EventSetting } from "../types/events";
import { useRefreshContext } from "../contexts/RefreshContext";

function AgendaPage() {
  const [events, setEvents] = useState<EventSetting[]>([]);
  const { refresh, newElement } = useRefreshContext();

  useEffect(() => {
    refresh;
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
  }, [refresh]);

  return (
    <div className="agenda-container">
      <section>
        <h2>Agenda</h2>
      </section>
      <div className="agenda-events-container">
        {events.map((event, index) =>
          index === events.length - 1 && newElement ? (
            <AgendaEvent
              key={nanoid()}
              event={event}
              newEventToBeModified={true}
            />
          ) : (
            <AgendaEvent
              key={nanoid()}
              event={event}
              newEventToBeModified={false}
            />
          ),
        )}
        <AgendaAdd events={events} />
      </div>
    </div>
  );
}

export default AgendaPage;
