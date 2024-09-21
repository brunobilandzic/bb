import mongoose from "mongoose";

const postSchema = {
  title: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: "UserPW" },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserPW",
    required: true,
  },
  logedIn: { type: Boolean, required: true },
};

const PostSchema = new mongoose.Schema(postSchema);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default Post;
