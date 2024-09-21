"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { Provider, useSelector } from "react-redux";
import store from "../../redux/store";
import AuthWrapper from "./AuthWrapper";

const SessionWrapper = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default function ClientWrapper({ children }) {
  return (
    <SessionWrapper>
      <Provider store={store}>
        <AuthWrapper>{children}</AuthWrapper>
      </Provider>
    </SessionWrapper>
  );
}
