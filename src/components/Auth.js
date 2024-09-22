"use client";

import { UserContext } from "./wrappers/ClientWrapper";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useContext } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";

export const SignInComponent = ({ classes }) => {
  const classString = classnames("text-green-900", classes);
  return (
    <>
      <button className={classString} onClick={() => signIn()}>
        Sign in
      </button>
    </>
  );
};

export const SignOutComponent = ({ classes }) => {
  const classString = classnames(classes);

  return (
    <>
      <button className={classString} onClick={() => signOut()}>
        Sign out
      </button>
    </>
  );
};

export default function AuthSection() {
  const user = useSelector((state) => {
    return state.userState?.user;
  });

  return (
    <div className="flex flex-col gap-2 align-middle">
      {!user && (
        <SignInComponent classes="bg-green-50 text-green-500 border-green-900 border py-1 mx-auto w-24 rounded-sm" />
      )}
      {user && (
        <SignOutComponent classes="bg-red-50 text-red-500 border-red-900 border py-1 mx-auto w-24 rounded-sm" />
      )}
    </div>
  );
}
