import "./globals.css";
import ClientWrapper from "../components/wrappers/ClientWrapper";
import NavBar from "@/components/Navbar";

export const metadata = {
  title: "Bruno Bilandzic Personal Website",
  description:
    "Welcome to Bruno's personal website. Here you can find information about Bruno.",
};

export default function RootLayout({ children }) {
  return (
    <ClientWrapper>
      <html lang="en">
        <body className="flex min-h-screen flex-col items-center justify-start">
          <NavBar />
          <div className="w-full  p-5"> {children}</div>
        </body>
      </html>
    </ClientWrapper>
  );
}
