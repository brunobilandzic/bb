import mongoose from "mongoose";

const userSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  provider: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] }],
};

const UserSchema = new mongoose.Schema(userSchema);

const UserPW = mongoose.models.UserPW || mongoose.model("UserPW", UserSchema);

export default UserPW;
