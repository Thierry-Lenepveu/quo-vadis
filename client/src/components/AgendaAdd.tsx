import { useAuth } from "../contexts/AuthProvider";
import { useRefreshContext } from "../contexts/RefreshContext";
import type { EventSetting } from "../types/events";

interface AgendaAddProps {
  events: EventSetting[];
}

function AgendaAdd({ events }: AgendaAddProps) {
  const { auth } = useAuth();
  const { setRefresh, setNewElement } = useRefreshContext();

  const transformDateUTC = (date: Date): Date => {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
      ),
    );
  };

  const handleAdd = () => {
    let currentStartDate = Math.ceil(Date.now() / 1800000) * 1800000;
    let currentEndDate = currentStartDate + 1800000;

    while (
      events.some(
        (item) =>
          (currentStartDate > item.StartTime.getTime() &&
            currentStartDate < item.EndTime.getTime()) ||
          (currentEndDate > item.StartTime.getTime() &&
            currentEndDate < item.EndTime.getTime()),
      )
    ) {
      currentStartDate += 1800000;
      currentEndDate += 1800000;
    }

    const newEvent: EventSetting = {
      Id: events.length + 1,
      StartTime: new Date(currentStartDate),
      EndTime: new Date(currentEndDate),
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
        start_time: transformDateUTC(newEvent.StartTime).toISOString(),
        end_time: transformDateUTC(newEvent.EndTime).toISOString(),
        subject: newEvent.Subject,
        description: newEvent.Description,
        location: newEvent.Location,
        color: newEvent.CategoryColor,
      }),
    })
      .then((res) => res.json())
      .then((_data) => {
        setRefresh((prev) => !prev);
        setNewElement(true);
      })
      .catch((error) => console.error("Error:", error));
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
