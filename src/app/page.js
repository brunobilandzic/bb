import Image from "next/image";
import { useContext, useState } from "react";
import { AppContext } from "./AppContextProvider";

export default function Home() {
  const { user, setUser } = useContext(AppContext);

  const handleUserChange = () => {
    setUser(user => !user);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-24">
      <h1 className="text-4xl font-bold">
        Welcome to Bruno&apos;s personal website
      </h1>
      <Image src="/vespa_cut.png" alt="Vespa" width={300} height={300} />
      <button onClick={handleUserChange}>
        Change user state
      </button>
    </main>
  );
}
