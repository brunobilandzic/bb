"use client";

import axios from "axios";
import LoadingWrapper from "./wrappers/LoadingWrapper";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

import { breakLoading, setLoading } from "../redux/slices/loadingSlice";
import { setPosts, addPost } from "../redux/slices/postsSlice";
import { now } from "mongoose";

const defaultPost = {
  title: "",
  content: "",
  creator: "",
};

// POSTS LIST

const PostsList = () => {
  const posts = useSelector((state) => state.postsState?.items);
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    if (posts) return;

    dispatch(setLoading());

    const response = await axios.get("/api/posts");
    dispatch(setPosts(response.data?.posts));

    dispatch(breakLoading());
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <LoadingWrapper>
      <div className="flex flex-col gap-5 items-beginningw-full">
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </LoadingWrapper>
  );
};

// NEW POST

const NewPost = () => {
  const [newPost, setNewPost] = useState(defaultPost);
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = useSelector((state) => state.userState.user);

  const handleChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());
    if (!newPost.title || !newPost.content) {
      dispatch(breakLoading());
      return;
    }

    if (!session && !newPost.username) {
      dispatch(breakLoading());
      return;
    }

    const response = await axios.post("/api/posts", {
      ...newPost,
    });

    console.log(response.data);

    dispatch(breakLoading());
    dispatch(addPost(response.data.newPost));
    setNewPost(defaultPost);
  };

  return (
    <>
      <LoadingWrapper>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col gap-4 items-center w-full ">
            <p className="text-xl font-bold w-fit ">New Post</p>
            <input
              className="w-full pl-2 py-1 input"
              type="text"
              name="title"
              value={newPost.title}
              onChange={handleChange}
              placeholder="Title"
            />
            <textarea
              className=" p-2 rounded-md input"
              name="content"
              rows="8"
              value={newPost.content}
              onChange={handleChange}
              placeholder="Content"
            />
            {!session && (
              <input
                className="w-full"
                type="text"
                name="username"
                value={newPost.username}
                onChange={handleChange}
                placeholder="Username"
              />
            )}
          </div>
          <button className="border border-black w-fit px-4 py-2 rounded-lg hover:shadow-md hover:bg-gray-200" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </LoadingWrapper>
    </>
  );
};

// POST COMPONENTS

const Post = ({ post }) => {
  if (!post) return null;

  const { username, title, content, createdAt } = post;

  return (
    <div>
      <p className="text-gray-500 text-sm">
        {" "}
        {new Date().getTime() - new Date(createdAt).getTime() <
        1000 * 60 * 60 * 24 * 5 ? (
          <ReactTimeAgo date={createdAt} locale="de" />
        ) : (
          new Date(createdAt).toLocaleString()
        )}{" "}
        | {username}
      </p>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default function Posts() {
  return (
    <>
      <NewPost />
      <PostsList />
    </>
  );
}
