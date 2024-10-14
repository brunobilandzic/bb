import AuthSection from "../components/Auth";
import { FaSun } from "react-icons/fa";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4">
      <div className="text-9xl text-green-800">
        <FaSun />
      </div>
      <AuthSection />
    </main>
  );
}
