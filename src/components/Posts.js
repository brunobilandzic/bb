"use client";

import axios from "axios";
import LoadingWrapper from "./wrappers/LoadingWrapper";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import { MdOutlineNoteAdd } from "react-icons/md";
import { MdBackspace } from "react-icons/md";

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
    <>
      <LoadingWrapper>
        <div className="flex flex-col gap-5 items-beginning w-full mt-3">
          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </LoadingWrapper>
    </>
  );
};

// NEW POST

const NewPost = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div
        className="flex items-center gap-2 text-2xl hover:cursor-pointer mb-3"
        onClick={() => setIsOpen(!isOpen)}>
        <div>{!isOpen && "New Post"}</div>
        <div>{!isOpen ? <MdOutlineNoteAdd /> : <MdBackspace />}</div>
      </div>
      {isOpen && (
        <LoadingWrapper>
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-col gap-4 items-center w-full ">
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
            <button
              className="border border-black w-fit px-4 py-2 rounded-lg hover:shadow-md hover:bg-gray-200"
              onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </LoadingWrapper>
      )}
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

//  BLOG

export function BlogPosts() {
  const [blogPosts, setBlogPosts] = useState(null);

  useEffect(() => {
    if (blogPosts) return;
    const fetchBlogPosts = async () => {
      const response = await axios.get("/api/blog-posts");
      setBlogPosts(response.data.blogPosts);
    };

    fetchBlogPosts();
  }, [blogPosts]);

  return (
    <div>
      <NewBlogPost />
      <h1 className="text-2xl font-bolder mb-4">Welcome to Bruno's blog!</h1>
      {blogPosts?.map((post) => (
        <BlogPost key={post._id} {...post} />
      ))}
    </div>
  );
}

function BlogPost({ createdAt, title, content }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{createdAt}</p>
      <h1 className="font-bold text-lg">{title}</h1>
      <p>{content}</p>
    </div>
  );
}

const NewBlogPost = () => {
  const [newBlogPost, setNewBlogPost] = useState({
    title: "",
    content: "",
  });
  const user = useSelector((state) => state.userState.user);
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !user.role == "ADMIN") return null;

  const handleChange = (e) => {
    setNewBlogPost({ ...newBlogPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(newBlogPost);

    const response = await axios.post("/api/blog-posts", newBlogPost);
    console.log(response.data);
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-2xl hover:cursor-pointer mb-3"
        onClick={() => setIsOpen(!isOpen)}>
        <div>{!isOpen && "New Blog Post"}</div>
        <div>{!isOpen ? <MdOutlineNoteAdd /> : <MdBackspace />}</div>
      </div>
      <div>
        {isOpen && (
          <LoadingWrapper>
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col gap-4 items-center w-full ">
                <input
                  className="w-full pl-2 py-1 input"
                  type="text"
                  name="title"
                  value={newBlogPost.title}
                  onChange={handleChange}
                  placeholder="Title"
                />
                <textarea
                  className="p-2 rounded-md input"
                  name="content"
                  value={newBlogPost.content}
                  onChange={handleChange}
                  placeholder="Content"
                  rows="8"
                />
              </div>
              <button
                className="border border-black w-fit px-4 py-2 rounded-lg hover:shadow-md hover:bg-gray-200"
                onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </LoadingWrapper>
        )}
      </div>
    </>
  );
};

//  ABOUT

export function About() {
  return <div>About</div>;
}

function AboutItem({ title, content }) {
  return (
    <div>
      <p className="font-bold text-lg">{title}</p>
      <p>{content}</p>
    </div>
  );
}

//  CONTACT

export function Contact() {
  return <div>Contact</div>;
}
