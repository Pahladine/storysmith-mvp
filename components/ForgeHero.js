// components/ForgeHero.js

import { useState, useEffect } from 'react';
import { conversation } from './forgeHeroContent'; // Import the new content

export default function ForgeHero({
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
  sharedResponse,
}) {
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('start');
  const [userProvidedName, setUserProvidedName] = useState('');
  const [userProvidedAge, setUserProvidedAge] = useState('');

  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });

  useEffect(() => {
    if (currentForgeHeroStep === 0) {
        setSharedResponse("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?");
    }
  }, [currentForgeHeroStep]);

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
  
  const handleQuestionAnswer = (field, value, nextQuestion) => {
    setHeroDetails(prev => ({...prev, [field]: value}));
    setCurrentQuestion(nextQuestion);
  };

  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  
  const renderConversationalForm = () => {
    const currentStep = conversation[currentQuestion];
    if (currentStep) {
        setSharedResponse(currentStep.question);
        const gridClass = currentStep.choices.some(c => c.gridCols) ? 'grid grid-cols-2 gap-4' : 'flex flex-col items-center space-y-4';
        
        return (
            <div className={gridClass}>
                {currentStep.choices.map((choice, index) => (
                    <button 
                        key={index} 
                        className={`${choiceButtonStyle} ${choice.gridCols ? `col-span-${choice.gridCols}` : ''}`} 
                        onClick={() => {
                            if (choice.action) {
                                setCurrentQuestion(choice.action);
                            } else {
                                handleQuestionAnswer(choice.field, choice.value, choice.next);
                            }
                        }}
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
        );
    }

    // Handle special input cases
    switch (currentQuestion) {
      case 'name_provide':
        // ... name input logic
      case 'age_provide':
        // ... age input logic
      case 'traits':
        // ... final step logic
      default:
        return null;
    }
  }

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
      case 2:
          return renderConversationalForm();
      default: return (
        <div className="text-center text-stone-700">
            <p>This step is under construction.</p>
        </div>
      );
    }
  };

  return (
    <div 
        className="w-full max-w-lg mx-auto h-[70vh] flex flex-col p-8 rounded-lg shadow-2xl"
        style={{
            backgroundColor: '#F5F0E8',
            color: '#4f463c',
            fontFamily: '"Cinzel", serif',
            border: '2px solid #D1C7B8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
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