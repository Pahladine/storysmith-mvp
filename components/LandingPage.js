import React, { useState } from 'react';
import { Button } from '../components/ui/button';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe-direct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('error');
    }
  };

  return (
    <section className="relative flex items-center justify-center h-screen bg-gradient-to-b from-purple-800 to-indigo-900 text-white">
      <div className="absolute inset-0 opacity-30">
        {/* Background video or image can go here */}
      </div>
      <div className="relative z-10 max-w-2xl text-center px-6">
        <p className="text-lg font-medium mb-4">Welcome, dreamer!</p>
        <h1 className="text-5xl font-extrabold leading-tight mb-2">
          I am the Keeper of Stories
        </h1>
        <h2 className="text-3xl font-semibold mb-6">
          Your Story, Magically Told.
        </h2>
        <p className="text-base mb-8">
          Let AI weave your tale with a touch of wonder. Enter your email to embark on your magical journey.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full sm:w-auto flex-grow px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
            required
          />
          <Button type="submit" className="px-6 py-3 rounded-lg">
            Begin Your Story
          </Button>
        </form>
        {status === 'success' && <p className="mt-4 text-green-300">You’ve been subscribed!</p>}
        {status === 'error' && <p className="mt-4 text-red-300">Oops! Something went wrong.</p>}
      </div>
    </section>
  );
};

export default LandingPage;
