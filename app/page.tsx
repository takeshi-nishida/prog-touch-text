import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <header className="mb-12">
        <h1 className="text-5xl font-bold">Welcome to ProgTouch-Text!</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center text-center">
      </main>
      <footer className="flex h-24 w-full items-center justify-center border-t">
        &copy; {new Date().getFullYear()} ProgTouch-Text
      </footer>
    </div>
  );
}
