// components/ForgeHero.js

import { useState, useEffect } from 'react';

export default function ForgeHero({
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
}) {
  const [isImageLoading_local, setIsImageLoading_local] = useState(false);
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('start');

  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    setSharedResponse("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?");
  }, []);

  const generateRealImage = async (prompt) => { /* ... */ };
  const handleHeroTypeSelection = (type) => { /* ... */ };
  const handlePhotoFileChange = async (event) => { /* ... */ };
  const handleQuestionAnswer = (field, value, nextQuestion) => { /* ... */ };
  const handleForgeHeroSubmit = () => { /* ... */ };
  const constructHeroPrompt = (details = heroDetails) => { /* ... */ };
  const handleForgeHeroCompletion = () => { /* ... */ };
  
  // NEW STYLING for the conversational buttons
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm";
  
  const renderConversationalForm = () => { /* ... */ };

  const renderStepContent = () => {
    switch (currentForgeHeroStep) {
      // ... cases for steps remain the same logic, but will use the new button styles
      case 0:
        return (
          <div className="space-y-4">
            <button onClick={() => handleHeroTypeSelection('real')} className={choiceButtonStyle}>A real person I know or love</button>
            <button onClick={() => handleHeroTypeSelection('fictional')} className={choiceButtonStyle}>A brand new hero, born from imagination!</button>
            <button onClick={() => handleHeroTypeSelection('surprise')} className={choiceButtonStyle}>Surprise me, StorySmith!</button>
          </div>
        );
      // ... other cases would be styled similarly
      default: return null;
    }
  };

  return (
    // THIS IS THE NEW PARCHMENT CONTAINER
    <div 
        className="w-full max-w-lg mx-auto h-[70vh] flex flex-col p-8 rounded-lg shadow-2xl"
        style={{
            backgroundColor: '#F5F0E8', // Parchment color
            color: '#4f463c', // Dark brown text color
            fontFamily: '"Cinzel", serif',
            border: '2px solid #D1C7B8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
    >
      {/* KEEPER'S DIALOGUE */}
      <div 
        id="shared-response-box-parchment"
        className="w-full text-center text-xl mb-8 p-4 border-b-2 border-stone-400/50"
      >
        {/* The shared response is now handled by the parent, but we can have a placeholder or duplicate */}
        Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?
      </div>

      {/* USER'S CHOICES (Content Area) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
        {renderStepContent()}
      </div>
    </div>
  );
}