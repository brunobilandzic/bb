import mongoose from "mongoose";

const postSchema = {
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  content: { type: String, required: true },
  username: { type: String },
  response: { type: String, default: "" },
  type: {
    type: String,
    enum: ["post", "blog-post", "about-section"],
    default: "post",
  },
};

const PostSchema = new mongoose.Schema(postSchema);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
