import {
  Day,
  type EventRenderedArgs,
  Inject,
  Month,
  ScheduleComponent,
  Week,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import { L10n } from "@syncfusion/ej2-base";
import local from "../locale.json";
import "../styles/Calendar.css";
import { useEffect, useState } from "react";
import {
  EventSetting,
  type EventFromDB,
  type EventSettings,
} from "../types/events";
import { useRefreshContext } from "../contexts/RefreshContext";
import { useNavigate } from "react-router-dom";

function CalendarPage() {
  L10n.load(local);

  const { refresh } = useRefreshContext();

  const [eventSettings, setEventSettings] = useState<EventSettings | null>({
    dataSource: [] as EventSetting[],
    allowAdding: false,
    allowDeleting: false,
    allowEditing: false,
  });

  const onEventRendered = (args: EventRenderedArgs) => {
    args.element.style.backgroundColor = args.data.CategoryColor;
  };

  const navigate = useNavigate();

  useEffect(() => {
    refresh;

    fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
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
        setEventSettings({
          dataSource: data.map(
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
          allowAdding: false,
          allowDeleting: false,
          allowEditing: false,
        });
      });
  }, [refresh, navigate]);

  return (
    <div className="calendar-container">
      <h2>Calendrier</h2>
      <ScheduleComponent
        selectedDate={new Date(Date.now())}
        eventSettings={eventSettings}
        eventRendered={onEventRendered}
        locale="fr"
      >
        <Inject services={[Day, Week, WorkWeek, Month]} />
      </ScheduleComponent>
    </div>
  );
}

export default CalendarPage;
