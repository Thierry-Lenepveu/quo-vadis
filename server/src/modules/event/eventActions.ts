import type { RequestHandler } from "express";
import eventRepository from "./eventRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const events = await eventRepository.readAll();

    res.json(events);
  } catch (error) {
    next(error);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);

    const event = await eventRepository.read(id);

    if (event) {
      res.status(200).json(event);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const event = {
      id: Number.parseInt(req.params.id),
      user_id: req.body.user_id,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      subject: req.body.subject,
      description: req.body.description,
      location: req.body.location,
      color: req.body.color,
    };

    const updatedId = await eventRepository.update(event);
    res.status(200).json({ updatedId });
  } catch (error) {
    next(error);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the user data from the request body
    const newEvent = {
      user_id: req.body.user_id,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      subject: req.body.subject,
      description: req.body.description,
      location: req.body.location,
      color: req.body.color,
    };

    // Create the user
    const insertId = await eventRepository.create(newEvent);

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

    await eventRepository.delete(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export default {
  browse,
  read,
  add,
  edit,
  destroy,
};
