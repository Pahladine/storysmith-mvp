import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>MYMGG – StorySmith Waitlist</title>
        <meta
          name="description"
          content="Join the waitlist for MYMGG — the home of StorySmith, your AI-powered storybook builder."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-yellow-300 text-white font-sans">
        <header className="w-full py-8 bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-extrabold mb-4">🚨 TEST: Redeploy Check 🚨</h1>
              MYMGG
            </h1>
            <p className="mt-2 text-lg text-gray-600 italic">
              The home of <span className="font-semibold text-indigo-700">StorySmith</span> —
              your AI-powered storybook builder.
            </p>
          </div>
        </header>

        <main className="max-w-3xl mx-auto mt-16 px-6 animate-fade-in">
          <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-4">
              Join the Waitlist
            </h2>
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
                className="w-full h-full rounded-md border"
              >
                Loading…
              </iframe>
            </div>
          </section>
        </main>

        <footer className="mt-24 py-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} MYMGG. All rights reserved.
        </footer>
      </div>
    </>
  );
}
