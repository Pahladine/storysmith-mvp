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

  const generateRealImage = async (prompt) => {
    setIsImageLoading_local(true);
    setHeroImageUrl(''); 

    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image.');
      }

      const data = await response.json();
      setHeroImageUrl(data.imageUrl);

    } catch (error) {
      console.error("Error generating image:", error);
      setSharedResponse(`An error occurred: ${error.message}`);
    } finally {
      setIsImageLoading_local(false);
    }
  };

  const handleHeroTypeSelection = (type) => {
    setHeroDetails(prev => ({ ...prev, type }));
    if (type === 'real') {
      setCurrentForgeHeroStep(1);
      setSharedResponse("How marvelous! A legend in the making! To truly capture their essence, would you be willing to share a photograph of our hero?");
    } else if (type === 'fictional') {
      setCurrentForgeHeroStep(2); 
      setCurrentQuestion('name'); 
      setSharedResponse("Wonderful! A hero born of pure imagination! Together, we shall give them form and heart. Let us begin!");
    } else if (type === 'surprise') {
      const simulatedHero = { name: "Sparklehoof", age: "6", gender: "non-binary", traits: "brave, curious, and kind", wardrobe: "a shimmering tunic", signatureItem: "a glowing mossy pebble" };
      setHeroDetails(simulatedHero);
      generateRealImage(constructHeroPrompt(simulatedHero));
      setCurrentForgeHeroStep(3);
      setSharedResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?");
    }
  };
  
  const handlePhotoFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setHeroDetails(prev => ({ ...prev, photoFile: file }));
    setSharedResponse("Uploading your image, please wait...");

    try {
      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) throw new Error('Failed to upload file.');

      const newBlob = await response.json();
      setUploadedImageUrl(newBlob.url);
      setSharedResponse("Magnificent! I have received the image. Now, let us discover the details that a photograph can only guess at... the true heart of our hero!");
      setCurrentForgeHeroStep(2);
      setCurrentQuestion('name');

    } catch (error) {
      console.error(error);
      setSharedResponse(`An error occurred during upload: ${error.message}`);
    }
  };
  
  const handleQuestionAnswer = (field, value, nextQuestion) => {
    setHeroDetails(prev => ({...prev, [field]: value}));
    setCurrentQuestion(nextQuestion);
  };

  const handleForgeHeroSubmit = () => {
      const prompt = constructHeroPrompt();
      setSharedResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?");
      generateRealImage(prompt);
      setCurrentForgeHeroStep(3);
  };

  const constructHeroPrompt = (details = heroDetails) => {
    // ... construct prompt logic ...
  };

  const handleForgeHeroCompletion = () => {
    // ... completion logic ...
  };
  
  // NEW STYLING for the conversational buttons
  const choiceButtonStyle = "w-full max-w-md text-left p-4 bg-black/20 backdrop-blur-sm border border-stone-500/50 rounded-lg text-stone-200 hover:bg-stone-700/70 hover:border-stone-400 transition-all duration-300 shadow-lg";
  
  const renderConversationalForm = () => {
    // ... conversational form logic from before ...
  };

  // MAIN RENDER LOGIC FOR THIS COMPONENT
  const renderStepContent = () => {
    switch (currentForgeHeroStep) {
      case 0:
        return (
          <div className="w-full max-w-md mx-auto space-y-4">
            <button onClick={() => handleHeroTypeSelection('real')} className={choiceButtonStyle}>A real person I know or love</button>
            <button onClick={() => handleHeroTypeSelection('fictional')} className={choiceButtonStyle}>A brand new hero, born from imagination!</button>
            <button onClick={() => handleHeroTypeSelection('surprise')} className={choiceButtonStyle}>Surprise me, StorySmith!</button>
          </div>
        );
      case 1:
        return (
          <div className="w-full max-w-md mx-auto">
            <label htmlFor="photo-upload" className={`${choiceButtonStyle} cursor-pointer block text-center`}>
              Upload a Photograph
            </label>
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
            {heroDetails.photoFile && (<p className="mt-4 text-sm text-center text-stone-300">File selected: {heroDetails.photoFile.name}</p>)}
          </div>
        );
      case 2:
        return renderConversationalForm(); // The conversational part we built before
      
      case 3:
        // This is the step where the final image is shown. We can add more styling here later.
        return (
          <div className="text-center w-full max-w-md mx-auto">
              {isImageLoading_local ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-400"></div>
                </div>
              ) : heroImageUrl ? (
                <div>
                  <img src={heroImageUrl} alt="Generated Hero Portrait" className="rounded-lg shadow-2xl mb-6" />
                  <div className="space-y-4">
                    <button onClick={() => { /* ... */ }} className={choiceButtonStyle}>Yes, that’s perfect!</button>
                    <button onClick={() => { /* ... */ }} className={choiceButtonStyle}>Not quite, let’s refine.</button>
                  </div>
                </div>
              ) : ( <p>An error occurred.</p> )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-end p-8">
      {/* This is the new container for the text and buttons. 
          It's aligned to the bottom for a more conversational feel. */}
      {renderStepContent()}
    </div>
  );
}