// The B of BREAD - Browse (Read) operation

import type { RequestHandler } from "express";
import userRepository from "./userRepository";

const browse: RequestHandler = async (req, res, next) => {
  const { limit, offset, search } = req.query;
  try {
    const users = await userRepository.readAll();

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);

    const user = await userRepository.read(id);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the user data from the request body
    const newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      occupation: req.body.occupation,
      hashed_password: req.body.hashed_password,
    };

    // Create the user
    const insertId = await userRepository.create(newUser);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted user
    res.status(201).json({ insertId });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);

    await userRepository.delete(id);

    res.send(204);
  } catch (error) {
    next(error);
  }
};

const verifyEmail: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific user from the database based on the provided email
    const user = await userRepository.readByEmailWithPassword(
      req.query.email as string,
    );

    if (user == null) {
      res.sendStatus(404);
      return;
    }

    res.status(200).json(user.id);
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const user = {
      id: Number.parseInt(req.params.id),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      occupation: req.body.occupation,
    };

    const updatedId = await userRepository.update(user);
    res.status(200).json({ updatedId });
  } catch (error) {
    next(error);
  }
};

export default {
  browse,
  read,
  add,
  verifyEmail,
  update,
  destroy,
};
