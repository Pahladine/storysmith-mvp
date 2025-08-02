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
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'your_secret_password';

  const tabs = [
    { label: 'Forge Hero' },
    { label: 'Spin Tale' },
    { label: 'Bind Book' },
  ];
  
  // --- GENERAL PURPOSE FUNCTIONS ---
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    // Simplified for example
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

  const generateImageSimulated = async (prompt, type = 'scene') => {
    setIsImageLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const safePrompt = prompt || `A beautiful ${type} illustration`;
    const placeholderText = encodeURIComponent(safePrompt.substring(0, 20) + '...');
    let imageUrl = `https://placehold.co/400x300/3CB371/FFFFFF?text=${type}+${placeholderText}`;
    setIsImageLoading(false);
    return imageUrl;
  };
  
  const resetApp = () => {
      setStoryState(initialStoryState);
      setActiveTab(0);
      setShowLandingPage(true);
      setIsVideoFinished(false);
  }

  // --- RENDER LOGIC ---
  const renderAppInterface = () => (
    <div className="min-h-screen flex flex-col bg-gray-800 text-white" style={{ fontFamily: 'Lato, sans-serif' }}>
      <header className="bg-gray-900 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400" style={{ fontFamily: 'Cinzel, serif' }}>StorySmith</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" onClick={(e) => { e.preventDefault(); resetApp(); }} className="hover:text-indigo-300">Home</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col bg-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-600">
            <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-300" style={{ fontFamily: 'Cinzel, serif' }}>Forge Your Story</h2>
            <div className="flex justify-center mb-8 space-x-2 sm:space-x-4">
              {tabs.map((tab, index) => (
                <button key={index} onClick={() => setActiveTab(index)}
                  className={`px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 ${activeTab === index ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div id="shared-response-box" className="min-h-[100px] bg-gray-900 rounded-lg p-6 mb-6 text-gray-100 shadow-inner border border-gray-700">
                {/* This area can be used for global messages or responses from child components */}
            </div>

            {activeTab === 0 && <ForgeHero storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} generateImageSimulated={generateImageSimulated} isLoading={isLoading} isImageLoading={isImageLoading} />}
            {activeTab === 1 && <SpinTale storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} isLoading={isLoading} isImageLoading={isImageLoading} />}
            {activeTab === 2 && <BindBook storyState={storyState} setStoryState={setStoryState} setActiveTab={setActiveTab} resetApp={resetApp} generateImageSimulated={generateImageSimulated} isLoading={isLoading} isImageLoading={isImageLoading} setIsLoading={setIsLoading} setIsImageLoading={setIsImageLoading} />}
          
          </div>
          {activeTab === 2 && (
            <div className="w-full md:w-1/3 flex-shrink-0 bg-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-600">
              <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-300" style={{ fontFamily: 'Cinzel, serif' }}>The Grand Ledger</h3>
              <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                <LedgerContent storyState={storyState} />
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} StorySmith. All rights reserved.
        </div>
      </footer>
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