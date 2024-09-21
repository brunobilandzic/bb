import Posts from "../../components/Posts";
import AuthSection from "../../components/Auth";


export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-24">
      <h1 className="text-4xl font-bold">
        Welcome to Bruno&apos;s personal website
      </h1>
      {/*<Image src="/vespa_cut.png" alt="Vespa" width={300} height={300} /> */}
      <Posts />
      <AuthSection />
    </main>
  );
}
