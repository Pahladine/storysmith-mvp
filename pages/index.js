// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';
import ForgeHero from '../components/ForgeHero';
import SpinTale from '../components/SpinTale';
import BindBook from '../components/BindBook';
import useAdminAuth from '../hooks/useAdminAuth';

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
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '6425';

  const {
    showPasswordInput,
    setShowPasswordInput,
    adminPasswordInput,
    setAdminPasswordInput,
    handleAdminLogin,
  } = useAdminAuth(password, () => setShowLandingPage(false));

  const tabs = [
    { label: 'Forge Hero', videoSrc: '/videos/Keeper1.mp4', bgSrc: '/background1.jpg' },
    { label: 'Spin Tale', videoSrc: '/videos/Keeper2.mp4', bgSrc: '/background2.jpg' },
    { label: 'Bind Book', videoSrc: '/videos/Keeper3.mp4', bgSrc: '/background3.jpg' },
  ];
  
  const handleSignUpSubmit = (e) => { /* ... */ };
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
          <div className="max-w-screen-2xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-200" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.2)' }}>
              StorySmith
            </h1>
            <nav><ul className="flex space-x-6"><li><a href="#" onClick={(e) => { e.preventDefault(); resetApp(); }} className="text-gray-300 hover:text-white transition-colors">Home</a></li></ul></nav>
          </div>
        </header>
        
        <main className="flex-1 relative flex items-center justify-center">
            <div className="w-full max-w-screen-2xl mx-auto flex items-center justify-center px-8">
                {/* Left Side: Video Player */}
                <div className="w-1/2 flex justify-center pr-8">
                    <div className="w-full max-w-xl aspect-video relative rounded-2xl shadow-2xl overflow-hidden">
                        {/* THE FIX IS HERE: Changed object-contain to object-cover */}
                        <video
                            key={tabs[activeTab].videoSrc}
                            className="absolute top-0 left-0 w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src={tabs[activeTab].videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>

                {/* Right Side: Interactive Area */}
                <div className="w-1/2 flex justify-center pl-8">
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
        {/* Head content... */}
      </Head>
      {showLandingPage ? (
        <LandingPage 
          email={email}
          setEmail={setEmail}
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