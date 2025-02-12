import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  occupation: string;
  hashed_password: string;
};

class UserRepository {
  // The C of CRUD - Create operation

  async create(user: Omit<User, "id">) {
    // Execute the SQL INSERT query to add a new user to the "user" table
    const [result] = await databaseClient.query<Result>(
      `insert into user 
        (first_name, last_name, hashed_password, email, occupation)
        values
        (?, ?, ?, ?, ?)`,
      [
        user.first_name,
        user.last_name,
        user.hashed_password,
        user.email,
        user.occupation,
      ],
    );

    // Return the ID of the newly inserted user
    return result.insertId;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>(`select id, first_name,
       last_name,
       email,
       occupation from user`);
    return rows as Omit<User, "hashed_password">[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      `select id, first_name,
       last_name,
       email,
       occupation from user where id = ?`,
      [id],
    );

    return rows[0] as Omit<User, "hashed_password">;
  }

  async readByEmailWithPassword(email: string) {
    // Execute the SQL SELECT query to retrieve a specific user by its email
    const [rows] = await databaseClient.query<Rows>(
      `select id, first_name,
       last_name,
       email,
       hashed_password,
       occupation from user where email = ?`,
      [email],
    );

    // Return the first row of the result, which represents the user
    return rows[0] as User;
  }
  async update(user: Omit<User, "hashed_password">) {
    const [result] = await databaseClient.query<Result>(
      "update user set first_name = ?, last_name = ?, email = ?, occupation = ? where id = ?",
      [user.first_name, user.last_name, user.email, user.occupation, user.id],
    );
    return result;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from user where id = ?",
      [id],
    );

    return result;
  }
}

export default new UserRepository();
