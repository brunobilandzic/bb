"use client";

import axios from "axios";
import LoadingWrapper from "./wrappers/LoadingWrapper";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { breakLoading, setLoading } from "../redux/slices/loadingSlice";
import { setPosts, addPost } from "../redux/slices/postsSlice";

const defaultPost = {
  title: "",
  content: "",
  creator: "",
};

const PostsList = () => {
  const posts = useSelector((state) => state.postsState?.items);
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    dispatch(setLoading());

    const response = await axios.get("/api/posts");
    dispatch(setPosts(response.data?.posts));
    
    dispatch(breakLoading());
  };

  return (
    <LoadingWrapper>
      <div>
        <div>posts list</div>
        <div>{JSON.stringify(posts)}</div>
        <button onClick={fetchPosts}>Fetch posts</button>
      </div>
    </LoadingWrapper>
  );
};

const NewPost = () => {
  const [newPost, setNewPost] = useState(defaultPost);

  const { data: session } = useSession();

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPost.title || !newPost.content) {
      return;
    }

    if (!session && !newPost.creator) {
      return;
    }

    const response = await axios.post("/api/posts", {
      ...newPost,
      creator: session ? session.user.email : newPost.creator,
      logedIn: session ? true : false,
    });

    setNewPost(defaultPost);
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="flex flex-col gap-4 items-center">
        <p className="text-xl font-bold w-fit ">New Post</p>
        <input
          type="text"
          name="title"
          value={newPost.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          name="content"
          value={newPost.content}
          onChange={handleChange}
          placeholder="Content"
        />
        {!session && (
          <input
            type="text"
            name="creator"
            value={newPost.creator}
            onChange={handleChange}
            placeholder="Creator"
          />
        )}
      </div>
      <button className="border border-black w-fit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default function Posts() {
  return (
    <>
      <PostsList />
      <NewPost />
    </>
  );
}
