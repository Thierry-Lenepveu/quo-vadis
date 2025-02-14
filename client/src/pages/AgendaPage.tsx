import { useEffect, useState } from "react";
import "../styles/Agenda.css";
import "../styles/User.css";
import { nanoid } from "nanoid";
import AgendaEvent from "../components/AgendaEvent";
import AgendaAdd from "../components/AgendaAdd";
import { type EventFromDB, EventSetting } from "../types/events";
import { useRefreshContext } from "../contexts/RefreshContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

function AgendaPage() {
  const [events, setEvents] = useState<EventSetting[]>([]);
  const { refresh, newElement } = useRefreshContext();
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    refresh;
    fetch(`${import.meta.env.VITE_API_URL}/api/events/user/${auth?.user_id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login");
        }

        return res.json();
      })
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
  }, [refresh, navigate, auth]);

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
