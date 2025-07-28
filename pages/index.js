export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to MYMGG</h1>
      <p className="text-lg mb-8 max-w-xl text-center">
        MYMGG is the home of StorySmith—your AI‑powered storybook builder. Coming Soon!
      </p>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-gray-200 shadow-md">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSd420clo-i4bHuKN3h2l90TQgRiQC8n6UBKAC_9QLPSBN5knw/viewform?embedded=true"
          width="100%"
          height="700"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading…
        </iframe>
      </div>
    </main>
  );
}
