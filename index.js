import express from "express";
import jwt from "jsonwebtoken";
import { UserModel, TodoModel } from "./db.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);
const app = express();
app.use(express.json());
const JWT_SECRET = "kshitizvinitajivanshu";

const auth = (req, res, next) => {
  try {
    const { token } = req.headers;
    const decodedUser = jwt.verify(token, JWT_SECRET);
    if (decodedUser) {
      console.log(decodedUser.id);
      req.userId = decodedUser.id;
      console.log(req.userId);
      next();
    }
  } catch (e) {
    res.json({
      message: "You are not Signed in",
    });
  }
};
app.post("/signup", async (req, res) => {
  const { email, name, password } = req.body;
  await UserModel.create({
    email: email,
    name: name,
    password: password,
  });

  res.status(200).json({
    message: "You are signed up successfully",
  });
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({
    email: email,
    password: password,
  });
  if (user) {
    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      JWT_SECRET
    );
    res.status(200).json({
      token: token,
    });
  } else {
    res.status(403).json({
      message: "You are not signed up",
    });
  }
});

app.post("/todo", auth, async (req, res) => {
  const userId = req.userId;
  const { title, done } = req.body;
  await TodoModel.create({
    title: title,
    done: done,
    userId: userId,
  });
  res.send({
    message: "Todo Added",
  });
});

app.get("/todos", auth, async (req, res) => {
  const userId = req.userId;
  const todos = await TodoModel.find({
    userId: userId,
  });
  res.json({
    todos: todos,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
