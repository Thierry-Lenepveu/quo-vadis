// Options de hachage (voir documentation : https://github.com/ranisalt/node-argon2/wiki/Options)

import argon2 from "argon2";
import type { RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

const verifyEmailPassword = async (
  email: string,
  password: string,
  isAdmin: boolean,
): Promise<[string | undefined, number | undefined]> => {
  // Fetch a specific user from the database based on the provided email
  const user = await userRepository.readByEmailWithPassword(email);

  if (user == null) {
    return [undefined, undefined];
  }

  const verified = await argon2.verify(user.hashed_password, password);

  if (!verified) {
    return [undefined, undefined];
  }
  // Respond with the user and a signed token in JSON format (but without the hashed password)
  const { id, ...userWithoutHashedPassword } = user;

  const myPayload: QuoVadisPayload = {
    sub: id.toString(),
    isAdmin: isAdmin,
  };

  const token = await jwt.sign(myPayload, process.env.APP_SECRET as string, {
    expiresIn: "1h",
  });

  return [token, id];
};

const login: RequestHandler = async (req, res, next) => {
  try {
    const [token, id] = await verifyEmailPassword(
      req.body.email,
      req.body.password,
      false,
    );

    sendResponse(token, id, res, false);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const adminLogin: RequestHandler = async (req, res, next) => {
  try {
    const [token, id] = await verifyEmailPassword(
      req.body.email,
      req.body.password,
      true,
    );

    if (req.body.email !== process.env.ADMIN_EMAIL) {
      res.sendStatus(401);
    }

    sendResponse(token, id, res, true);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const sendResponse = (
  token: string | undefined,
  id: number | undefined,
  res: Response,
  isAdmin: boolean,
) => {
  if (token && id) {
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 3600000),
    });
    res.cookie("user_id", id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(Date.now() + 3600000),
    });
    res.json({
      user_id: id,
      is_admin: isAdmin,
    });
  } else {
    res.sendStatus(422);
  }
};

// Recommandations **minimales** de l'OWASP : https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    // Extraction du mot de passe de la requête
    const { password } = req.body;

    // Hachage du mot de passe avec les options spécifiées
    const hashedPassword = await argon2.hash(password, hashingOptions);

    // Remplacement du mot de passe non haché par le mot de passe haché dans la requête
    req.body.hashed_password = hashedPassword;

    // Oubli du mot de passe non haché de la requête : il restera un secret même pour notre code dans les autres actions
    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

const buildCookieObject = (cookieString: string | undefined, url: string) => {
  if (!cookieString) {
    throw new Error(`From ${url}, Cookie header is missing`);
  }

  const cookieArray = cookieString
    .split(";")
    .map((item) => item.trim())
    .map((pair) => {
      const [key, value] = pair.split("=");
      return [key, value];
    });

  return Object.fromEntries(cookieArray);
};

const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const cookieObject = buildCookieObject(
      req.get("Cookie"),
      req.url as string,
    );

    // Vérifier que l'en-tête a la forme "Bearer <token>"

    // Vérifier la validité du token (son authenticité et sa date d'expériation)
    // En cas de succès, le payload est extrait et décodé
    req.auth = jwt.verify(
      cookieObject.token,
      process.env.APP_SECRET as string,
    ) as QuoVadisPayload;

    next();
  } catch (err) {
    console.info(`${err}`);
    res.sendStatus(401);
  }
};

const verifyRequest: RequestHandler = (req, res) => {
  try {
    if (!req.auth) {
      throw new Error("Authentication failed");
    }

    res.json({
      user_id: req.auth.sub,
      is_admin: req.auth.isAdmin,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const disconnect: RequestHandler = (req, res) => {
  try {
    if (!req.auth) {
      throw new Error("Authentication failed");
    }

    const cookieObject = buildCookieObject(
      req.get("Cookie"),
      req.url as string,
    );
    if (!cookieObject.user_id) {
      throw new Error("User id not found in cookies");
    }
    res.cookie("token", cookieObject.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(Date.now() - 3600000),
    });
    res.cookie("user_id", cookieObject.user_id, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: new Date(Date.now() - 3600000),
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

export default {
  hashPassword,
  login,
  adminLogin,
  verifyToken,
  verifyRequest,
  disconnect,
};
