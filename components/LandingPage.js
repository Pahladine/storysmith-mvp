import { useState, useEffect } from 'react';

export default function LandingPage({ email, setEmail, showLandingPage, setShowLandingPage, isVideoFinished, setIsVideoFinished, handleSignUpSubmit }) {
  const handleVideoEnd = () => {
    setIsVideoFinished(true);
  };

  return (
    <div className="relative h-screen w-screen bg-black">
      {/* The main content area */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('/background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: isVideoFinished ? 1 : 0,
        }}
      >
        <div className="flex flex-col items-center justify-center h-full text-center text-white p-4 bg-black bg-opacity-40">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-4" style={{ fontFamily: 'Cinzel, serif', color: '#F5F0E8' }}>
            Your Imagination, Instantly Illustrated.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl" style={{ fontFamily: 'Lato, sans-serif', color: '#EAE0D5' }}>
            A new era of storytelling is coming soon. Sign up to be notified when we launch.
          </p>
          <form onSubmit={handleSignUpSubmit} className="flex flex-col sm:flex-row items-center w-full max-w-lg space-y-4 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 p-2 sm:p-3 rounded-lg text-gray-800 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Notify Me!
            </button>
          </form>
        </div>
      </div>
      {/* The promo video that plays on top */}
      <video
        className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ease-out"
        style={{
          opacity: isVideoFinished ? 0 : 1,
          pointerEvents: isVideoFinished ? 'none' : 'auto'
        }}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        src="/promo.mp4"
      >
        Your browser does not support the video tag.
      </video>
      {/* NEW: Hidden Admin Button */}
      <button
        onClick={() => setShowLandingPage(false)}
        className="absolute bottom-5 right-5 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-50 hover:opacity-100 transition-opacity z-20"
      >
        Admin
      </button>
    </div>
  );
}