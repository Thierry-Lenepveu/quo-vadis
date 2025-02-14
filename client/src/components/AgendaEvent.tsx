import { useEffect, useRef, useState } from "react";
import { type EventFromDB, EventSetting } from "../types/events";
import { useRefreshContext } from "../contexts/RefreshContext";
import { useAuth } from "../contexts/AuthProvider";

interface AgendaEventProps {
  event: EventSetting;
  newEventToBeModified: boolean;
}

function AgendaEvent({ event, newEventToBeModified }: AgendaEventProps) {
  const [modify, setModify] = useState(false);
  const subjectHtmlElement = useRef<HTMLHeadingElement>(null);
  const descriptionHtmlElement = useRef<HTMLParagraphElement>(null);
  const locationHtmlElement = useRef<HTMLParagraphElement>(null);
  const startDateHtmlElement = useRef<HTMLParagraphElement>(null);
  const startDateHtmlInputElement = useRef<HTMLInputElement>(null);
  const endDateHtmlInputElement = useRef<HTMLInputElement>(null);
  const endDateHtmlElement = useRef<HTMLParagraphElement>(null);
  const colorHtmlInputElement = useRef<HTMLInputElement>(null);

  const { auth } = useAuth();

  const [events, setEvents] = useState<EventSetting[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { newElement, setNewElement, setRefresh } = useRefreshContext();

  const [subject, setSubject] = useState<string>(event.Subject);
  const [description, setDescription] = useState<string>(event.Description);
  const [location, setLocation] = useState<string>(event.Location);
  const [startDate, setStartDate] = useState<Date>(event.StartTime);
  const [endDate, setEndDate] = useState<Date>(event.EndTime);
  const [categoryColor, setCategoryColor] = useState<string>(
    event.CategoryColor,
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(
          data
            .map(
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
            )
            .filter(
              (item: EventSetting) => item.Id !== event.Id,
            ) as EventSetting[],
        );
      });

    if (newElement && newEventToBeModified) {
      setModify(true);
      handleModify();
    }
  }, [newElement, newEventToBeModified, event]);

  const colorToRgb = (color: string) => {
    // Vérifie que la chaîne commence par '#' et a une longueur de 7 caractères
    if (color.startsWith("#") && color.length === 7) {
      // Convertit les sous-chaînes hexadécimales en entiers
      const red = Number.parseInt(color.substring(1, 3), 16);
      const green = Number.parseInt(color.substring(3, 5), 16);
      const blue = Number.parseInt(color.substring(5, 7), 16);
      return { red, green, blue };
    }
    throw new Error("La chaîne doit être au format '#RRGGBB'");
  };

  const isLightColor = (backgroundColor: string) => {
    const { red, green, blue } = colorToRgb(backgroundColor);
    const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    return luminance > 0.5;
  };
  const colorFromCategory = (backgroundColor: string) => {
    return isLightColor(backgroundColor) ? "black" : "white";
  };

  const handleChangeStartDate = () => {
    setStartDate(new Date(startDateHtmlInputElement.current?.value as string));
  };
  const handleChangeEndDate = () => {
    setEndDate(new Date(endDateHtmlInputElement.current?.value as string));
  };
  const handleChangeColor = () => {
    setCategoryColor(colorHtmlInputElement.current?.value as string);
  };

  const handleModify = () => {
    if (modify) {
      setModify(false);
      if (subjectHtmlElement.current) {
        subjectHtmlElement.current.contentEditable = "false";
        subjectHtmlElement.current.classList.remove("editable");
      }
      if (descriptionHtmlElement.current) {
        descriptionHtmlElement.current.contentEditable = "false";
        descriptionHtmlElement.current.classList.remove("editable");
      }
      if (locationHtmlElement.current) {
        locationHtmlElement.current.contentEditable = "false";
        locationHtmlElement.current.classList.remove("editable");
      }
    } else {
      setModify(true);
      if (subjectHtmlElement.current) {
        subjectHtmlElement.current.contentEditable = "true";
        subjectHtmlElement.current.classList.add("editable");
      }
      if (descriptionHtmlElement.current) {
        descriptionHtmlElement.current.contentEditable = "true";
        descriptionHtmlElement.current.classList.add("editable");
      }
      if (locationHtmlElement.current) {
        locationHtmlElement.current.contentEditable = "true";
        locationHtmlElement.current.classList.add("editable");
      }
    }
  };

  const actionSave = () => {
    if (modify) {
      const currentStartDate = new Date(
        startDateHtmlInputElement.current?.value as string,
      ).getTime();
      const currentEndDate = new Date(
        endDateHtmlInputElement.current?.value as string,
      ).getTime();
      if (currentStartDate > currentEndDate) {
        setErrorMessage(
          "La date de début doit être antérieure à la date de fin",
        );
        return;
      }

      if (
        events.some(
          (item) =>
            (currentStartDate > item.StartTime.getTime() &&
              currentStartDate < item.EndTime.getTime()) ||
            (currentEndDate > item.StartTime.getTime() &&
              currentEndDate < item.EndTime.getTime()),
        )
      ) {
        setErrorMessage("Les dates se chevauchent avec un autre événement");
        setModify(true);
        return;
      }

      fetch(`${import.meta.env.VITE_API_URL}/api/events/${event.Id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: auth?.user_id,
          start_time: startDateHtmlInputElement.current?.value,
          end_time: endDateHtmlInputElement.current?.value,
          subject: subjectHtmlElement.current?.textContent,
          description: descriptionHtmlElement.current?.textContent,
          location: locationHtmlElement.current?.textContent,
          color: colorHtmlInputElement.current?.value,
        }),
      })
        .then((res) => res.json())
        .then((_data) => {
          setModify(false);
          setNewElement(false);
          if (subjectHtmlElement.current?.textContent) {
            setSubject(subjectHtmlElement.current.textContent);
          }

          if (descriptionHtmlElement.current?.textContent) {
            setDescription(descriptionHtmlElement.current.textContent);
          }
          if (locationHtmlElement.current?.textContent) {
            setLocation(locationHtmlElement.current.textContent);
          }
          if (startDateHtmlInputElement.current) {
            setStartDate(new Date(startDateHtmlInputElement.current.value));
          }
          if (endDateHtmlInputElement.current) {
            setEndDate(new Date(endDateHtmlInputElement.current.value));
          }
          if (colorHtmlInputElement.current) {
            setCategoryColor(colorHtmlInputElement.current.value);
          }
          setRefresh((prev) => !prev);
          setErrorMessage("");
        })
        .catch((_error) => {
          setErrorMessage("Erreur lors de la modification de l'événement");
        });
      setModify(false);
    } else {
      setModify(true);
      setErrorMessage("");
    }
  };

  const transformDate = (date: Date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const handleClickModify = () => {
    actionSave();
  };

  const handleKeyDownModify = () => {
    actionSave();
  };

  const handleClickDelete = () => {
    setDeleteConfirmation(true);
  };
  const handleKeyDownDelete = () => {
    setDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setDeleteConfirmation(false);
  };
  const handleCancelDelete = () => {
    setDeleteConfirmation(false);
  };

  const handleDelete = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/events/${event.Id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.status === 204) {
        setRefresh((prev) => !prev);
      }
    });
  };

  return (
    <article className="agenda-event" style={{ borderColor: categoryColor }}>
      <section
        className="header"
        style={{
          backgroundColor: categoryColor,
          color: colorFromCategory(categoryColor),
        }}
      >
        <h3 className="event-subject" ref={subjectHtmlElement}>
          {subject}
        </h3>
        {!deleteConfirmation && (
          <>
            <img
              src={
                modify
                  ? isLightColor(event.CategoryColor)
                    ? "/images/save.svg"
                    : "/images/save-white.svg"
                  : isLightColor(event.CategoryColor)
                    ? "/images/edit.svg"
                    : "/images/edit-white.svg"
              }
              alt="modifier"
              onClick={handleClickModify}
              onKeyDown={handleKeyDownModify}
            />
            <img
              src={
                isLightColor(event.CategoryColor)
                  ? "/images/trash.svg"
                  : "/images/trash-white.svg"
              }
              alt="supprimer"
              onClick={handleClickDelete}
              onKeyDown={handleKeyDownDelete}
            />
          </>
        )}
      </section>
      {deleteConfirmation && (
        <div className="delete-confirmation">
          <p>Confirmer la suppression?</p>
          <div className="buttons-group">
            <button
              type="button"
              onClick={handleConfirmDelete}
              style={{
                backgroundColor: categoryColor,
                color: colorFromCategory(categoryColor),
              }}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={handleCancelDelete}
              style={{
                backgroundColor: categoryColor,
                color: colorFromCategory(categoryColor),
              }}
            >
              Non
            </button>
          </div>
        </div>
      )}
      {!deleteConfirmation && (
        <>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <section className="event-description-group">
            <p className="key">Description: </p>
            <p className="event-description value" ref={descriptionHtmlElement}>
              {description}
            </p>
          </section>
          <section className="event-location-group">
            <p className="key">Lieu: </p>
            <p className="event-location value" ref={locationHtmlElement}>
              {location}
            </p>
          </section>
          {!modify && (
            <>
              <section className="event-start-date-group">
                <p className="key">Date de début: </p>
                <p
                  className="event-start-date value"
                  ref={startDateHtmlElement}
                >
                  {startDate.toLocaleString()}
                </p>
              </section>
              <section className="event-end-date-group">
                <p className="key">Date de fin: </p>
                <p className="event-end-date value" ref={endDateHtmlElement}>
                  {endDate.toLocaleString()}
                </p>
              </section>
            </>
          )}
          {modify && (
            <>
              <section className="event-start-date-group">
                <p className="key">Date de début: </p>
                <input
                  type="datetime-local"
                  ref={startDateHtmlInputElement}
                  value={transformDate(startDate)}
                  onChange={handleChangeStartDate}
                />
              </section>
              <section className="event-end-date-group">
                <p className="key">Date de fin: </p>
                <input
                  type="datetime-local"
                  ref={endDateHtmlInputElement}
                  value={transformDate(endDate)}
                  onChange={handleChangeEndDate}
                />
              </section>
              <section className="event-category-group">
                <p className="key">Catégorie: </p>
                <input
                  type="color"
                  ref={colorHtmlInputElement}
                  value={categoryColor}
                  onChange={handleChangeColor}
                />
              </section>
            </>
          )}
        </>
      )}
    </article>
  );
}

export default AgendaEvent;
