// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';
import ForgeHero from '../components/ForgeHero';
import SpinTale from '../components/SpinTale';
import BindBook, { LedgerContent } from '../components/BindBook';

const initialStoryState = {
  metadata: {},
  user_info: {},
  story_data: { story_title: "", thematic_tone: null, visual_style: "3D animated Film", visual_consistency_tag: null },
  story_content: { CharacterBlock: {}, StoryBlueprintBlock: {}, SceneJSON_array: [], AssetsManifest: { scene_illustration_urls: [], cover_image_url: null, hero_image_url: null }, Cover: {} }
};

export default function Home() {
  // --- TOP-LEVEL STATE MANAGEMENT ---
  const [email, setEmail] = useState('');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [storyState, setStoryState] = useState(initialStoryState);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '6425';
  
  const [sharedResponse, setSharedResponse] = useState("");

  // UPDATED this section to match your filenames
  const tabs = [
    { label: 'Forge Hero', videoSrc: '/videos/Keeper1.mp4' },
    { label: 'Spin Tale', videoSrc: '/videos/Keeper2.mp4' },
    { label: 'Bind Book', videoSrc: '/videos/Keeper3.mp4' },
  ];
  
  // --- GENERAL PURPOSE FUNCTIONS ---
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      alert(`Thank you for signing up, ${email}!`);
      setEmail('');
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === password) {
      setShowLandingPage(false);
      setShowPasswordInput(false);
      setAdminPasswordInput('');
    } else {
      alert('Incorrect password!');
      setAdminPasswordInput('');
    }
  };

  const generateImageSimulated = async (prompt, type = 'scene') => { /* ... */ };
  
  const resetApp = () => {
      setStoryState(initialStoryState);
      setActiveTab(0);
      setShowLandingPage(true);
      setIsVideoFinished(false);
  };

  // --- RENDER LOGIC ---
  const renderAppInterface = () => (
    <div className="min-h-screen flex flex-col text-white relative" style={{ fontFamily: 'Lato, sans-serif' }}>
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('/app-background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', filter: 'blur(4px) brightness(0.7)', transform: 'scale(1.05)' }} />
      <div className="absolute inset-0 z-1 bg-black/30" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="bg-transparent py-4 border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-200" style={{ fontFamily: 'Cinzel, serif' }}>StorySmith</h1>
            <nav><ul className="flex space-x-6"><li><a href="#" onClick={(e) => { e.preventDefault(); resetApp(); }} className="text-gray-300 hover:text-white transition-colors">Home</a></li></ul></nav>
          </div>
        </header>
        
        {/* NEW TWO-COLUMN LAYOUT */}
        <main className="flex-1 py-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

            {/* NEW LEFT COLUMN: CHARACTER VIDEO PLAYER */}
            <div className="w-full h-full flex items-center justify-center">
              <video
                key={tabs[activeTab].videoSrc} // The key prop forces the video to re-render on change
                className="w-full h-full object-cover max-w-md rounded-lg shadow-2xl"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={tabs[activeTab].videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE CARD */}
            <div className="flex-1 flex flex-col bg-gray-800/50 backdrop-blur-sm border border-stone-500/30 rounded-2xl shadow-2xl p-6 sm:p-8">
              <h2 className="text-3xl font-semibold mb-6 text-center text-stone-200" style={{ fontFamily: 'Cinzel, serif' }}>Forge Your Story</h2>
              <div className="flex justify-center mb-8 space-x-2 sm:space-x-4">
                {tabs.map((tab, index) => (
                  <button key={index} onClick={() => setActiveTab(index)}
                    className={`px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 ${activeTab === index ? 'bg-stone-700 text-white shadow-lg border border-stone-500' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700/80'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div id="shared-response-box" className="min-h-[100px] bg-gray-900/70 rounded-lg p-6 mb-6 text-gray-100 shadow-inner border border-stone-600/50">
                  {sharedResponse}
              </div>

              {activeTab === 0 && <ForgeHero storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} />}
              {activeTab === 1 && <SpinTale storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} />}
              {activeTab === 2 && <BindBook storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} resetApp={resetApp} />}
            </div>
          </div>
        </main>

        <footer className="bg-transparent py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-8 text-center text-gray-400 text-sm">
            &copy; 2025 StorySmith. All rights reserved.
          </div>
        </footer>
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
      {showLandingPage ? <LandingPage email={email} setEmail={setEmail} showLandingPage={showLandingPage} setShowLandingPage={setShowLandingPage} isVideoFinished={isVideoFinished} setIsVideoFinished={setIsVideoFinished} handleSignUpSubmit={handleSignUpSubmit} showPasswordInput={showPasswordInput} setShowPasswordInput={setShowPasswordInput} adminPasswordInput={adminPasswordInput} setAdminPasswordInput={setAdminPasswordInput} handleAdminLogin={handleAdminLogin} /> : renderAppInterface()}
    </>
  );
}