import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";
import authActions from "./modules/auth/authActions";
import userActions from "./modules/user/userActions";
import eventActions from "./modules/event/eventActions";

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);
router.get("/api/users/verify-email", userActions.verifyEmail);

router.post("/api/users", authActions.hashPassword, userActions.add);

router.post("/api/login", authActions.login);

router.use(authActions.verifyToken);

router.get("/api/auth", authActions.verifyRequest);
router.get("/api/logout", authActions.disconnect);

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);
router.put("/api/users/:id", userActions.update);
router.delete("/api/users/:id", userActions.destroy);

router.get("/api/events", eventActions.browse);
router.get("/api/events/:id", eventActions.read);
router.put("/api/events/:id", eventActions.edit);
router.post("/api/events", eventActions.add);
router.delete("/api/events/:id", eventActions.destroy);

/* ************************************************************************* */

export default router;
