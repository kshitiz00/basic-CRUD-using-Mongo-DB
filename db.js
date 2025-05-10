import mongoose from "mongoose";
import { Schema } from "mongoose";
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
  email: { type: String, unique: true },
  name: String,
  password: String,
});

const todoSchema = new Schema({
  title: String,
  done: Boolean,
  userId: ObjectId,
});

const UserModel = mongoose.model("users", userSchema);
const TodoModel = mongoose.model("todos", todoSchema);

export { UserModel, TodoModel };
