// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';
import ForgeHero from '../components/ForgeHero';
import SpinTale from '../components/SpinTale';
import BindBook from '../components/BindBook';

const initialStoryState = {
  // ... initial state data
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [storyState, setStoryState] = useState(initialStoryState);
  const [sharedResponse, setSharedResponse] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '6425';

  const tabs = [
    { label: 'Forge Hero', videoSrc: '/videos/Keeper1.mp4', bgSrc: '/background1.jpg' },
    { label: 'Spin Tale', videoSrc: '/videos/Keeper2.mp4', bgSrc: '/background2.jpg' },
    { label: 'Bind Book', videoSrc: '/videos/Keeper3.mp4', bgSrc: '/background3.jpg' },
  ];
  
  const handleSignUpSubmit = (e) => { /* ... */ };
  const handleAdminLogin = () => { /* ... */ };
  const resetApp = () => { /* ... */ };

  const renderAppInterface = () => (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden" style={{ fontFamily: 'Lato, sans-serif' }}>
      {/* Dynamic Background System */}
      <div className="absolute inset-0 z-0">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url('${tab.bgSrc}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              opacity: activeTab === index ? 1 : 0,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 z-1 bg-black/50" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-transparent py-4">
            {/* Header content... */}
        </header>
        
        {/* NEW CINEMATIC LAYOUT */}
        <main className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-7xl flex items-center justify-center">
                {/* Left Side: Larger Character Video */}
                <div className="w-1/2 flex justify-center">
                    <video
                        key={tabs[activeTab].videoSrc}
                        className="w-auto h-[80vh] max-h-[80vh] rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src={tabs[activeTab].videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Right Side: Overlapping Interactive Area */}
                <div className="w-1/2 -ml-32">
                    {activeTab === 0 && <ForgeHero storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} sharedResponse={sharedResponse} />}
                    {activeTab === 1 && <SpinTale storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} />}
                    {activeTab === 2 && <BindBook storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} resetApp={resetApp} />}
                </div>
            </div>
        </main>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>StorySmith - Your Imagination, Illustrated</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      {showLandingPage ? (
        <LandingPage 
          email={email}
          setEmail={setEmail}
          showLandingPage={showLandingPage}
          setShowLandingPage={setShowLandingPage}
          isVideoFinished={isVideoFinished}
          setIsVideoFinished={setIsVideoFinished}
          handleSignUpSubmit={handleSignUpSubmit}
          showPasswordInput={showPasswordInput}
          setShowPasswordInput={setShowPasswordInput}
          adminPasswordInput={adminPasswordInput}
          setAdminPasswordInput={setAdminPasswordInput}
          handleAdminLogin={handleAdminLogin} 
        />
      ) : renderAppInterface()}
    </>
  );
}