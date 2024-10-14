"use client";

import axios from "axios";
import LoadingWrapper from "./wrappers/LoadingWrapper";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import { MdOutlineNoteAdd, MdWhatsapp } from "react-icons/md";
import { MdBackspace } from "react-icons/md";
import { MdOutlineWhatsapp } from "react-icons/md";
import { MdFacebook } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

import { breakLoading, setLoading } from "../redux/slices/loadingSlice";
import { setPosts, addPost, newResponse } from "../redux/slices/postsSlice";

const defaultPost = {
  title: "",
  content: "",
  username: "",
};

// POSTS

export function Posts() {
  return (
    <>
      <NewPost />
      <PostsList />
    </>
  );
}

const PostsList = () => {
  const posts = useSelector((state) => state.postsState?.items);
  const dispatch = useDispatch();

  const fetchPosts = async () => {
    if (posts) return;

    dispatch(setLoading());

    const response = await axios.get("/api/posts", {
      params: { type: "post" },
    });
    dispatch(setPosts(response.data?.posts));

    dispatch(breakLoading());
  };

  useEffect(() => {
    fetchPosts();
  });

  return (
    <>
      <LoadingWrapper>
        <div className="flex flex-col gap-5 items-beginning w-full mt-3">
          {posts?.map((post) => (
            <Post key={post._id} {...post} />
          ))}
        </div>
      </LoadingWrapper>
    </>
  );
};

const NewPost = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newPost, setNewPost] = useState(defaultPost);
  const dispatch = useDispatch();
  const { data: session } = useSession();

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

    const response = await axios.post("/api/posts", {
      ...newPost,
    });

    dispatch(breakLoading());
    dispatch(addPost(response.data.newPost));
    setNewPost(defaultPost);
    setIsOpen(false);
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 text-4xl text-green-950 hover:text-green-700 hover:cursor-pointer mb-3"
        onClick={() => setIsOpen(!isOpen)}>
        <div className={`${!isOpen && "-ml-1.5"}`}>
          {!isOpen ? <MdOutlineNoteAdd /> : <MdBackspace />}
        </div>
      </div>
      {isOpen && (
        <LoadingWrapper>
          <div className="flex flex-col gap-5">
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
              className="border border-black w-fit px-4 py-2 rounded-lg hover:shadow-md hover:bg-gray-200 mb-4"
              onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </LoadingWrapper>
      )}
    </div>
  );
};

const Post = ({
  username,
  title,
  content,
  createdAt,
  response,
  _id,
  blogPost,
  aboutPost,
}) => {
  const user = useSelector((state) => state.userState.user);

  return (
    <div className="bg-neutral-300 border-l-8 border-neutral-400 pl-3">
      <div className="mb-4">
        {!aboutPost && (
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
        )}
        <h1 className="text-lg font-semibold underline-offset-2 underline">
          {title}
        </h1>
        <p>{content}</p>
      </div>
      {!blogPost && !aboutPost && (
        <div>
          {response?.length == 0 && user?.role != "admin" && (
            <div>Bruno hasn&apos;t responded yet.</div>
          )}
          {response?.length == 0 && user?.role == "admin" && (
            <NewResponse postId={_id} />
          )}
          {response?.length > 0 && (
            <div>
              <h1 className="text-sm font-semibold">Bruno&apos;s Response:</h1>
              <p>{response}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// RESPONSE

const NewResponse = ({ postId }) => {
  const user = useSelector((state) => state.userState.user);
  const [isOpen, setIsOpen] = useState(false);
  const [response, setResponse] = useState("");
  const dispatch = useDispatch();

  if (!user) return;
  if (!user.role == "ADMIN") return;

  const handleChange = (e) => {
    setResponse(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading());

    const res = await axios.patch("/api/posts/", {
      postId,
      response,
    });

    dispatch(newResponse({ postId, response }));

    dispatch(breakLoading());
  };

  return (
    <>
      {!isOpen && (
        <div
          className="flex items-center gap-2 text-sm hover:cursor-pointer border w-fit border-green-950 rounded-sm px-5 py-2 hover:bg-green-950 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}>
          Write Response <MdOutlineNoteAdd />
        </div>
      )}
      {isOpen && (
        <>
          <div className="text-xl mb-2 text-green-950 hover:text-green-700">
            <MdBackspace />
          </div>
          <LoadingWrapper>
            <div className="flex flex-col gap-2">
              <input
                className="p-2 rounded-md input"
                name="response"
                value={response}
                onChange={handleChange}
                placeholder="Response"
              />
              <button
                className="border border-black w-fit px-4 py-2 rounded-lg hover:shadow-md hover:bg-gray-200"
                onClick={handleSubmit}>
                Submit
              </button>
            </div>{" "}
          </LoadingWrapper>
        </>
      )}
    </>
  );
};

//  BLOG

export function BlogPosts() {
  const [blogPosts, setBlogPosts] = useState(null);

  useEffect(() => {
    if (blogPosts) return;
    const fetchBlogPosts = async () => {
      const response = await axios.get("/api/posts", {
        params: { type: "blog-post" },
      });
      setBlogPosts(response.data.posts);
    };

    fetchBlogPosts();
  }, [blogPosts]);

  return (
    <div>
      <NewBlogPost />
      <h1 className="text-2xl font-bolder mb-4">
        Welcome to Bruno&apos;s blog!
      </h1>
      {blogPosts?.map((post) => (
        <Post blogPost key={post._id} {...post} />
      ))}
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

    const response = await axios.post("/api/posts", {
      ...newBlogPost,
      type: "blog-post",
    });

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

export function AboutComponent() {
  const [aboutPosts, setAboutPosts] = useState(null);
  const user = useSelector((state) => state.userState.user);

  useEffect(() => {
    if (aboutPosts) return;
    const fetchAboutPosts = async () => {
      const response = await axios.get("/api/posts", {
        params: { type: "about-section" },
      });
      setAboutPosts(response.data.posts);
    };

    fetchAboutPosts();
  }, [aboutPosts]);
  return (
    <div>
      <NewAboutPost />
      <LoadingWrapper>
        <div className="flex flex-col gap-5 items-beginning w-full mt-3">
          {aboutPosts?.map((post) => (
            <Post key={post._id} {...post} aboutPost />
          ))}
        </div>
      </LoadingWrapper>
    </div>
  );
}

const NewAboutPost = () => {
  const user = useSelector((state) => state.userState.user);
  const [newAboutPost, setNewAboutPost] = useState({
    title: "",
    content: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !user.role == "ADMIN") return null;

  const handleChange = (e) => {
    setNewAboutPost({ ...newAboutPost, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post("/api/posts", {
      ...newAboutPost,
      type: "about-section",
    });

    console.log(response.data);
  };

  return (
    <>
      <div
        className="flex items-center gap-2 text-2xl hover:cursor-pointer mb-3"
        onClick={() => setIsOpen(!isOpen)}>
        <div>{!isOpen && "New About Section"}</div>
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
                  value={newAboutPost.title}
                  onChange={handleChange}
                  placeholder="Title"
                />
                <textarea
                  className="p-2 rounded-md input"
                  name="content"
                  value={newAboutPost.content}
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

//  CONTACT

export function ContactComponent() {
  return (
    <div>
      <div className="flex gap-10 mt-5 text-4xl contact-icons justify-center px-20">
        <a href="https://wa.me/385996786769" target="_blank">
          <MdWhatsapp />
        </a>
        <a href="https://www.facebook.com/bruno.bilandzic.14/" target="_blank">
          <MdFacebook />
        </a>
        <a href="https://www.instagram.com/wolgabb/" target="_blank">
          <FaInstagram />
        </a>
        <a href="mailto:bruno.bilandzic@outlook.com" target="_blank">
          <MdEmail />
        </a>
        <a
          href="https://www.linkedin.com/in/bruno-biland%C5%BEi%C4%87-7906a21a9/"
          target="_blank">
          <FaLinkedin />
        </a>
        <a href="https://github.com/brunobilandzic" target="_blank">
          <FaGithub />
        </a>
      </div>
      <div>
        <p className="text-center mt-5 font-semibold italic text-green-700">
          CONSIDER GOING VEGAN FOR THE ANIMALS AND THE PLANET
        </p>
      </div>
    </div>
  );
}
