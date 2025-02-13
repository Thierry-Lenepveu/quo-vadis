import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type EventSetting = {
  id: number;
  user_id: string;
  start_time: string;
  end_time: string;
  subject: string;
  description: string;
  location: string;
  color: string;
};

class EventRepository {
  // The C of CRUD - Create operation

  async create(event: Omit<EventSetting, "id">) {
    // Execute the SQL INSERT query to add a new user to the "user" table
    const [result] = await databaseClient.query<Result>(
      `insert into schedule 
          (user_id, start_time, end_time, subject, description, location, color)
          values
          (?, ?, ?, ?, ?, ?, ?)`,
      [
        event.user_id,
        this.convertDateFormat(event.start_time),
        this.convertDateFormat(event.end_time),
        event.subject,
        event.description,
        event.location,
        event.color,
      ],
    );

    // Return the ID of the newly inserted user
    return result.insertId;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "select id, user_id, start_time, end_time, subject, description, location, color from schedule",
    );
    console.info(rows as EventSetting[]);
    return rows as EventSetting[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select user_id, start_time, end_time, subject, description, location, color from schedule where id = ?",
      [id],
    );

    return rows[0] as EventSetting;
  }

  async update(event: EventSetting) {
    const [result] = await databaseClient.query<Result>(
      "update schedule set user_id = ?, start_time = ?, end_time = ?, subject = ?, description = ?, location = ?, color = ? where id = ?",
      [
        event.user_id,
        this.convertDateFormat(event.start_time),
        this.convertDateFormat(event.end_time),
        event.subject,
        event.description,
        event.location,
        event.color,
        event.id,
      ],
    );
    return result;
  }

  convertDateFormat(dateString: string) {
    if (
      !dateString.includes("-") ||
      !dateString.includes("T") ||
      !dateString.includes(".")
    ) {
      return dateString;
    }

    const [date, time] = dateString.split("T");
    const timeNoMilliSeconds = time.split(".")[0];
    const [year, month, day] = date.split("-");
    const [hour, minute, second] = timeNoMilliSeconds.split(":");

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    return formattedDate;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from schedule where id = ?",
      [id],
    );

    return result;
  }
}

export default new EventRepository();
