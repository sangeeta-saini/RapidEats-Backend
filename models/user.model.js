import mongoose from "mongoose";

const schema = mongoose.Schema;

const UserSchema = new schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "password is must"],
    lowercase: true,
    trim: true,
    unique: true,
  },
});

export default mongoose.model("user", UserSchema, "user");
