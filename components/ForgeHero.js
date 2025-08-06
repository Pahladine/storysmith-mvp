// components/ForgeHero.js

import { useState, useEffect } from 'react';

export default function ForgeHero({
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
  sharedResponse,
}) {
  const [isImageLoading_local, setIsImageLoading_local] = useState(false);
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('start');
  const [userProvidedName, setUserProvidedName] = useState('');
  const [userProvidedAge, setUserProvidedAge] = useState(''); // New state for custom age

  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    if (currentForgeHeroStep === 0) {
        setSharedResponse("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?");
    }
  }, [currentForgeHeroStep]);

  const generateRealImage = async (prompt) => { /* ... */ };

  const handleHeroTypeSelection = (type) => {
      setHeroDetails(prev => ({ ...prev, type }));
      if (type === 'real') {
          setCurrentForgeHeroStep(1);
          setSharedResponse("How marvelous! A legend in the making! To truly capture their essence, would you be willing to share a photograph of our hero?");
      } else if (type === 'fictional') {
          setCurrentForgeHeroStep(2);
          setCurrentQuestion('name');
      } else if (type === 'surprise') {
          const simulatedHero = { name: "Sparklehoof", age: "6", gender: "non-binary", traits: "brave, curious, and kind", wardrobe: "a shimmering tunic", signatureItem: "a glowing mossy pebble" };
          setHeroDetails(simulatedHero);
          // generateRealImage(constructHeroPrompt(simulatedHero));
          setCurrentForgeHeroStep(3);
          setSharedResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?");
      }
  };
  
  const handlePhotoFileChange = async (event) => { /* ... */ };
  
  const handleQuestionAnswer = (field, value, nextQuestion) => {
    setHeroDetails(prev => ({...prev, [field]: value}));
    setCurrentQuestion(nextQuestion);
  };
  
  const handleNameChoice = (choice) => {
      if (choice === 'user_provides') {
          setCurrentQuestion('name_provide');
      } else if (choice === 'ai_suggests') {
          setCurrentQuestion('name_suggestions');
      } else {
          handleQuestionAnswer('name', 'Glimmerhart', 'age');
      }
  };

  const handleForgeHeroSubmit = () => { /* ... */ };
  const constructHeroPrompt = (details = heroDetails) => { /* ... */ };
  const handleForgeHeroCompletion = () => { /* ... */ };
  
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold";
  
  const renderConversationalForm = () => {
    switch (currentQuestion) {
      case 'name':
        setSharedResponse("And what name shall the heralds sing for this hero of ours?");
        return (
          <div className="flex flex-col items-center space-y-4">
            <button className={choiceButtonStyle} onClick={() => handleNameChoice('user_provides')}>1. I have a name in mind!</button>
            <button className={choiceButtonStyle} onClick={() => handleNameChoice('ai_suggests')}>2. I'd like you to suggest a few fitting names!</button>
            <button className={choiceButtonStyle} onClick={() => handleNameChoice('ai_whimsical')}>3. Let's make up a whimsical fantasy name together!</button>
            <button className={choiceButtonStyle} onClick={() => handleNameChoice('ai_surprise')}>4. Surprise me, StorySmith!</button>
          </div>
        );
      
      case 'name_provide':
        // ... (name provide logic)
      
      case 'name_suggestions':
        // ... (name suggestions logic)

      case 'age':
        setSharedResponse("How many years has our hero adventured?");
        return (
          <div className="grid grid-cols-2 gap-4">
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', '4', 'gender')}>A. 4 years old</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', '5', 'gender')}>B. 5 years old</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', '6', 'gender')}>C. 6 years old</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', '7', 'gender')}>D. 7 years old</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', '8', 'gender')}>E. 8 years old</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', '9', 'gender')}>F. 9 years old</button>
            <button className={`${choiceButtonStyle} col-span-2`} onClick={() => setCurrentQuestion('age_provide')}>I have a different age in mind!</button>
            <button className={`${choiceButtonStyle} col-span-2`} onClick={() => handleQuestionAnswer('age', 'AI Surprise', 'gender')}>Surprise me, StorySmith! 🎲</button>
          </div>
        );

      // NEW STEP: Handle user providing a custom age
      case 'age_provide':
        setSharedResponse("Wonderful! How old is our hero?");
        return (
          <div className="flex flex-col items-center space-y-4">
            <input 
              type="number" 
              value={userProvidedAge} 
              onChange={(e) => setUserProvidedAge(e.target.value)} 
              className="w-full p-3 rounded-lg bg-white/50 text-stone-800 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-400" 
              placeholder="Enter hero's age..."
            />
            <button 
              className={choiceButtonStyle} 
              onClick={() => handleQuestionAnswer('age', userProvidedAge, 'gender')}
            >
              Confirm Age
            </button>
          </div>
        );

      case 'gender':
        setSharedResponse("And how shall we refer to our hero?");
        // ... (gender logic)
        return <p className="text-stone-700">Gender questions would appear here...</p>;
      
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