export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to MYMGG</h1>
      <p className="text-lg mb-8 max-w-xl text-center">
        MYMGG is the home of StorySmith—your AI‑powered storybook builder. Coming Soon!
      </p>
      <div className="w-full max-w-md">
        <iframe
          src="https://docs.google.com/forms/d/e/1UhX9wiepKyAdzwl2TPY4Kik-BkUzJ2Kz7J-w7IZq7t8/viewform?embedded=true"
          width="100%" height="500" frameBorder="0" marginHeight="0" marginWidth="0"
        >Loading…</iframe>
      </div>
    </main>
  );
}
