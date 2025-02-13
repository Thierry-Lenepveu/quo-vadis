import { useEffect, useRef, useState } from "react";
import type { EventSetting } from "../types/event";

interface AgendaEventProps {
  event: EventSetting;
}

function AgendaEvent({ event }: AgendaEventProps) {
  const [modify, setModify] = useState(false);
  const subjectHtmlElement = useRef<HTMLHeadingElement>(null);
  const descriptionHtmlElement = useRef<HTMLParagraphElement>(null);
  const locationHtmlElement = useRef<HTMLParagraphElement>(null);
  const dateHtmlElement = useRef<HTMLParagraphElement>(null);
  const colorHtmlElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (subjectHtmlElement.current) {
      subjectHtmlElement.current.textContent = event.Subject;
    }
    if (descriptionHtmlElement.current) {
      descriptionHtmlElement.current.textContent = event.Description;
    }
    if (locationHtmlElement.current) {
      locationHtmlElement.current.textContent = event.Location;
    }
    if (dateHtmlElement.current) {
      dateHtmlElement.current.textContent = `${event.StartTime.toLocaleString()} - ${event.EndTime.toLocaleString()}`;
    }
    if (colorHtmlElement.current) {
      colorHtmlElement.current.value = event.CategoryColor;
    }
  }, [event]);

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

  const handleClickModify = () => {
    handleModify();
  };
  const handleKeyDownModify = () => {
    handleModify();
  };

  return (
    <article
      className="agenda-event"
      style={{ borderColor: event.CategoryColor }}
    >
      <section
        className="header"
        style={{
          backgroundColor: event.CategoryColor,
          color: colorFromCategory(event.CategoryColor),
        }}
      >
        <h3 className="event-subject" ref={subjectHtmlElement}>
          {}
        </h3>
        <img
          src={
            isLightColor(event.CategoryColor)
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
          onClick={handleClickModify}
          onKeyDown={handleKeyDownModify}
        />
      </section>
      <section className="event-description-group">
        <p className="key">Description: </p>
        <p className="event-description value" ref={descriptionHtmlElement} />
      </section>
      <section className="event-location-group">
        <p className="key">Lieu: </p>
        <p className="event-location value" ref={locationHtmlElement} />
      </section>
      {!modify && (
        <section className="event-date-group">
          <p className="key">Date: </p>
          <p className="event-category value" ref={dateHtmlElement} />
        </section>
      )}
      {modify && (
        <section className="event-category-group">
          <p className="key">Catégorie: </p>
          <input type="color" ref={colorHtmlElement} />
        </section>
      )}
    </article>
  );
}

export default AgendaEvent;
