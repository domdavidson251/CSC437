// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import * as path from "path";
import { PathLike } from "node:fs";
import fs from "node:fs/promises";
import { connect } from "./mongoConnect";
import apiRouter from "./routes/api"
import { loginUser, registerUser } from "./auth";

connect("blazing");

const app = express();
const port = process.env.PORT || 3000;

const frontend = "lit-frontend";
let cwd = process.cwd();
let dist: PathLike | undefined;
let indexHtml: PathLike | undefined;

try {
  indexHtml = require.resolve(frontend);
  dist = path.dirname(indexHtml.toString());
} catch (error: any) {
  console.log(`Could not resolve ${frontend}:`, error.code);
  dist = path.resolve(cwd, "..", frontend, "dist");
  indexHtml = path.resolve(dist, "index.html");
}

if (dist) app.use(express.static(dist.toString()));

app.use(cors());
app.use(express.json());

app.post("/login", loginUser);
app.post("/signup", registerUser);
app.use("/api", apiRouter)

// SPA route; always returns index.html
app.use("/app", (req, res) => {
  if (!indexHtml) {
    res
      .status(404)
      .send(
        `Not found; ${frontend} not available, running in ${cwd}`
      );
  } else {
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
      res.send(html)
    );
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});