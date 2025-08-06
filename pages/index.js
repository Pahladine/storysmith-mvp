// pages/index.js

import { useState } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';
import ForgeHero from '../components/ForgeHero';
import SpinTale from '../components/SpinTale';
import BindBook from '../components/BindBook'; // Removed LedgerContent as it's now internal to BindBook

const initialStoryState = {
  metadata: {},
  user_info: {},
  story_data: { story_title: "", thematic_tone: null, visual_style: "3D animated Film", visual_consistency_tag: null },
  story_content: { CharacterBlock: {}, StoryBlueprintBlock: {}, SceneJSON_array: [], AssetsManifest: { scene_illustration_urls: [], cover_image_url: null, hero_image_url: null }, Cover: {} }
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
  
  const handleSignUpSubmit = (e) => {
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
  
  const resetApp = () => {
      setStoryState(initialStoryState);
      setActiveTab(0);
      setShowLandingPage(true);
      setIsVideoFinished(false);
  };

  const renderAppInterface = () => (
    <div className="min-h-screen flex flex-col text-white relative overflow-hidden" style={{ fontFamily: 'Lato, sans-serif' }}>
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
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-200" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 5px rgba(255, 255, 255, 0.2)' }}>
              StorySmith
            </h1>
            <nav><ul className="flex space-x-6"><li><a href="#" onClick={(e) => { e.preventDefault(); resetApp(); }} className="text-gray-300 hover:text-white transition-colors">Home</a></li></ul></nav>
          </div>
        </header>
        
        <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center p-8">
            <div className="w-full h-full flex items-center justify-center p-4">
              <video
                key={tabs[activeTab].videoSrc}
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
            <div className="w-full h-full flex flex-col justify-center">
              {activeTab === 0 && <ForgeHero storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} />}
              {activeTab === 1 && <SpinTale storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} />}
              {activeTab === 2 && <BindBook storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} setSharedResponse={setSharedResponse} resetApp={resetApp} />}
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