import mongoose from "mongoose";

const blogPostObject = {
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
};

const BlogPostSchema = new mongoose.Schema(blogPostObject);

const BlogPost =
  mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);

export default BlogPost;
