// components/ForgeHero.js

import { useState, useEffect } from 'react';
import { conversation } from './forgeHeroContent';

export default function ForgeHero({
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
  sharedResponse,
}) {
  // ... all of your state and helper functions remain the same ...
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const handleHeroTypeSelection = (type) => {
      setHeroDetails(prev => ({ ...prev, type }));
      if (type === 'real') {
          setCurrentForgeHeroStep(1);
          setSharedResponse("How marvelous! A legend in the making!");
      } else if (type === 'fictional') {
          setCurrentForgeHeroStep(2);
          setCurrentQuestion('name');
      } else if (type === 'surprise') {
          // ... surprise logic
      }
  };
  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [currentQuestion, setCurrentQuestion] = useState('start');

  useEffect(() => {
    if (currentForgeHeroStep === 0) {
        setSharedResponse("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?");
    }
  }, [currentForgeHeroStep]);


  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  
  const renderConversationalForm = () => {
    // ... logic for rendering the conversational form ...
  };

  const renderStepContent = () => {
    switch (currentForgeHeroStep) {
      case 0:
        return (
          <div className="space-y-4">
            <button onClick={() => handleHeroTypeSelection('real')} className={choiceButtonStyle}>A real person I know or love</button>
            <button onClick={() => handleHeroTypeSelection('fictional')} className={choiceButtonStyle}>A brand new hero, born from imagination!</button>
            <button onClick={() => handleHeroTypeSelection('surprise')} className={choiceButtonStyle}>Surprise me, StorySmith!</button>
          </div>
        );
      // ... other cases
      default: return null;
    }
  };

  return (
    <div 
        // UPDATED: Height is now larger to prevent scrolling
        className="w-full max-w-lg mx-auto h-[80vh] flex flex-col p-8 rounded-lg shadow-2xl"
        style={{
            backgroundColor: 'rgba(245, 240, 232, 0.9)', // Slightly more transparent parchment
            color: '#4f463c',
            fontFamily: '"Cinzel", serif',
            border: '2px solid #D1C7B8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)', // Frosted glass effect for the parchment
        }}
    >
      <div 
        id="shared-response-box-parchment"
        className="w-full text-center text-xl mb-8 p-4 border-b-2 border-stone-400/50"
      >
        {sharedResponse}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        {renderStepContent()}
      </div>
    </div>
  );
}