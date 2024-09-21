import "./globals.css";
import ClientWrapper from "../../components/wrappers/ClientWrapper";

export const metadata = {
  title: "Bruno Bilandzic Personal Website",
  description:
    "Welcome to Bruno's personal website. Here you can find information about Bruno.",
};

export default function RootLayout({ children }) {
  return (
    <ClientWrapper>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClientWrapper>
  );
}
