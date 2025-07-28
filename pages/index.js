export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      <header className="w-full py-6 bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="text-5xl font-black text-gray-900">MYMGG</h1>
          <p className="mt-2 text-lg text-gray-600 italic">
            The home of StorySmith—your AI-powered storybook builder
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-12 px-6">
        <section className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-center">Join the Waitlist</h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Be the first to explore magical tools for kids, grandparents, and creators.
          </p>
          <div className="aspect-video">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSd420clo-i4bHuKN3h2l90TQgRiQC8n6UBKAC_9QLPSBN5knw/viewform?embedded=true"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              className="w-full h-full rounded-md"
            >
              Loading…
            </iframe>
          </div>
        </section>
      </main>

      <footer className="mt-20 py-6 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} MYMGG. All rights reserved.
      </footer>
    </div>
  );
}
