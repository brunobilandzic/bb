import mongoose from "mongoose";

const postSchema = {
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: "UserPW" },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPW",
  },
  logedIn: { type: Boolean, required: true },
  username: { type: String },
};

const PostSchema = new mongoose.Schema(postSchema);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
