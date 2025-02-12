import {
  Day,
  type EventRenderedArgs,
  Inject,
  Month,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
  WorkWeek,
} from "@syncfusion/ej2-react-schedule";
import { L10n } from "@syncfusion/ej2-base";
import local from "../locale.json";
import "../styles/Calendar.css";
import { useEffect, useState } from "react";
import type { EventSetting, EventSettings } from "../types/event";

function CalendarPage() {
  L10n.load(local);

  const [eventSettings, setEventSettings] = useState<EventSettings | null>(
    null,
  );

  const onEventRendered = (args: EventRenderedArgs) => {
    args.element.style.backgroundColor = args.data.CategoryColor;
  };

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEventSettings({
          dataSource: data as EventSetting[],
          allowAdding: false,
          allowDeleting: false,
          allowEditing: false,
        });
      });
  }, []);

  return (
    <div className="page-container">
      <h2>Calendrier</h2>
      <ScheduleComponent
        selectedDate={new Date(Date.now())}
        eventSettings={eventSettings}
        eventRendered={onEventRendered}
        locale="fr"
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month]} />
      </ScheduleComponent>
    </div>
  );
}

export default CalendarPage;
