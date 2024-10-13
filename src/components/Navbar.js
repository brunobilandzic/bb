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
    <div className="flex gap-5 text-xl">
      <NavItem href="/">Home</NavItem>
      <NavItem href="/posts">Posts</NavItem>
      <NavItem href="/blog">Blog</NavItem>
      <NavItem href="/about">About</NavItem>
      <NavItem href="/contact">Contact</NavItem>
    </div>
  );
};

const NavItem = ({ href, children }) => {
  return (
    <div className="cursor-pointer hover:text-green-50">
      {href ? <Link href={href}>{children}</Link> : children}
    </div>
  );
};

const UserNav = () => {
  const user = useSelector((state) => state.userState.user);

  return (
    <div className="self-end">
      {user ? <LoggedIn username={user?.username} /> : <NotLoggedIn />}
    </div>
  );
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
