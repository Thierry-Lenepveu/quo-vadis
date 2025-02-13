import { useAuth } from "../contexts/AuthProvider";
import type { EventSetting } from "../types/event";

interface AgendaAddProps {
  events: EventSetting[];
  setEvents: React.Dispatch<React.SetStateAction<EventSetting[]>>;
}

function AgendaAdd({ events, setEvents }: AgendaAddProps) {
  const { auth } = useAuth();

  const handleAdd = () => {
    const newEvent: EventSetting = {
      Id: events.length + 1,
      StartTime: new Date(),
      EndTime: new Date(),
      Subject: "Nouvel événement",
      Description: "Description",
      Location: "Lieu",
      CategoryColor: "#80b3ff",
    };
    fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: newEvent.Id,
        user_id: auth?.user_id,
        start_time: newEvent.StartTime,
        end_time: newEvent.EndTime,
        subject: newEvent.Subject,
        description: newEvent.Description,
        location: newEvent.Location,
        color: newEvent.CategoryColor,
      }),
    })
      .then((res) => res.json())
      .then((_data) => {
        setEvents([...events, newEvent]);
      });
  };

  return (
    <article className="agenda-event-add">
      <img
        src="/images/add.svg"
        alt="ajouter"
        onClick={handleAdd}
        onKeyDown={handleAdd}
      />
    </article>
  );
}

export default AgendaAdd;
