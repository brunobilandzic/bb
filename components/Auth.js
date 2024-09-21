"use client";

import { UserContext } from "./ClientWrapper";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useContext } from "react";
import classnames from "classnames";

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
  const { data: session } = useSession();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-2 align-middle">
      {user && <p className="text-2xl font-bold">{user.name}</p>}
      {!session && (
        <SignInComponent classes="bg-green-50 text-green-500 border-green-900 border py-1 mx-auto w-24 rounded-sm" />
      )}
      {session && (
        <SignOutComponent classes="bg-red-50 text-red-500 border-red-900 border py-1 mx-auto w-24 rounded-sm" />
      )}
    </div>
  );
}
