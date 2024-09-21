"use client";

import { SessionProvider } from "next-auth/react";
import { useState, createContext, useEffect } from "react";


const defaultUserContext = {
  user: null,
};

export const UserContext = createContext(defaultUserContext);

const SessionWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default function ClientWrapper({ children, session }) {
  const [user, setUser] = useState(defaultUserContext);

  return (
    <SessionWrapper>
      <UserContext.Provider value={{ user, setUser }}>
        <SessionProvider>{children}</SessionProvider>
      </UserContext.Provider>
    </SessionWrapper>
  );
}
