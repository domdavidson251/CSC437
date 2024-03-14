import jwt from "jsonwebtoken";
import credentials from "./services/credentials";
import profiles from "./services/profiles";
import { Profile } from "../../ts-models/profile";
import { Request, Response, NextFunction } from "express";

function generateAccessToken(username: string) {
  console.log("Generating token for", username);
  const { TOKEN_SECRET } = process.env;
  if (TOKEN_SECRET) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { username: username },
        TOKEN_SECRET,
        { expiresIn: "1d" },
        (error, token) => {
          if (error) reject(error);
          else resolve(token);
        }
      );
    });
  }
}

export function registerUser(req: Request, res: Response) {
  const { username, pwd } = req.body; // from form
  console.log(username);
  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .create(username, pwd)
      .then((creds) => generateAccessToken(creds.username))
      .then((token) => {
        res.status(201).send({ token: token });
        const profile: Profile = {
          userid: username,
          name: username,
          teams: [],
          leagues: []
        };
        profiles.create(profile);
      });
  }
}

export function loginUser(req: Request, res: Response) {
  const { username, pwd } = req.body; // from form

  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentials
      .verify(username, pwd)
      .then((goodUser: string | String) => generateAccessToken(goodUser.toString()))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send("Unauthorized"));
  }
}

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    const { TOKEN_SECRET } = process.env;
    if (TOKEN_SECRET) {
      jwt.verify(
        token,
        TOKEN_SECRET,
        (error, decoded) => {
          if (decoded) {
            console.log("Decoded token", decoded);
            next();
          } else {
            res.status(401).end();
          }
        }
      );
    }
  }
}