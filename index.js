import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import {
  registerValidation,
  loginValidation,
  postValidation,
} from "./validations.js";

import checkAuth from "./middleware/checkAuth.js";
import { remove } from "./controllers/PostController.js";

const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Db OK!"))
  .catch((err) => console.log(err));

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello, world!");
});

app.post("/auth/login", loginValidation, UserController.login);
app.post("/auth/register", registerValidation, UserController.register);
app.get("/auth/me", checkAuth, UserController.me);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postValidation, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts/:id", checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) return console.log(err);

  console.log("Server OK!");
});
