"use client";

import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { FaGoogle } from "react-icons/fa";

export default function NavBar() {
  return (
    <div className="flex w-full justify-between items-center p-5">
      <NavItems />
      <UserNav />
    </div>
  );
}

const NavItems = () => {
  return (
    <div className="flex gap-5">
      <NavItem href="/">Home</NavItem>
      <NavItem href="/posts">Posts</NavItem>
      <NavItem href="/blog">Blog</NavItem>
      <NavItem href="/about">About</NavItem>
      <NavItem href="/contact">Contact</NavItem>
    </div>
  );
};

const NavItem = ({ href, active, children }) => {
  return (
    <div className="cursor-pointer">
      {href ? <Link href={href}>{children}</Link> : children}
    </div>
  );
};

const UserNav = () => {
  const user = useSelector((state) => state.userState.user);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (!user) return;
    const assyncFunc = async () => {
      const _username = await getUsername(user.email);
      setUsername(_username);
    };
    assyncFunc();
  }, [user]);

  return (
    <div className="self-end">
      {username ? <LoggedIn username={username} /> : <NotLoggedIn />}
    </div>
  );
};

export const getUsername = async (email) => {
  const response = await axios.get("/api/user/username", { params: { email } });
  console.log(response.data);
  return response.data.username;
};

const NotLoggedIn = () => {
  return (
    <div onClick={() => signIn()}>
      <NavItem href={null}>
        <FaGoogle />
      </NavItem>
    </div>
  );
};

const LoggedIn = ({ username }) => {
  return (
    <div className="flex gap-2">
      <div className="font-semibold">{username}</div>

      <div onClick={() => signOut()}>
        <NavItem>Sign Out</NavItem>
      </div>
    </div>
  );
};
