// components/ForgeHero.js

import { useState, useEffect } from 'react';

export default function ForgeHero({
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
  sharedResponse, // Add this
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

  // --- HELPER FUNCTION LOGIC IS NOW RESTORED ---

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
    const { name, age, gender, traits, wardrobe, signatureItem } = details;
    let prompt = `${name || 'A young hero'}, a ${age || '7'}-year-old ${gender || 'child'} with ${traits || 'brave and curious'} traits, wearing ${wardrobe || 'a simple tunic and sturdy boots'}, holding ${signatureItem || 'a magical locket'}.`;
    prompt += " Style: 3D animated Film, Consistency Tag: whimsical_fantasy_child, Format: full body, front-facing. Lighting: soft cinematic. Rendered as a 3D animated film.";
    return prompt;
  };

  const handleForgeHeroCompletion = () => {
    setStoryState(prev => {
        const updatedStoryContent = {
            ...(prev.story_content || {}),
            CharacterBlock: { /* ... full logic ... */ },
            StoryBlueprintBlock: { /* ... full logic ... */ },
            AssetsManifest: { /* ... full logic ... */ },
        };
        const updatedStoryData = { /* ... full logic ... */ };
        return { ...prev, story_content: updatedStoryContent, story_data: updatedStoryData };
    });
    setActiveTab(1);
  };
  
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold";
  
  const renderConversationalForm = () => {
    // ... conversational form logic using handleQuestionAnswer
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
      case 1:
        return (
          <div className="w-full">
            <label htmlFor="photo-upload" className={`${choiceButtonStyle} cursor-pointer block text-center`}>
              Upload a Photograph
            </label>
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
            {heroDetails.photoFile && (<p className="mt-4 text-sm text-center text-stone-700">File selected: {heroDetails.photoFile.name}</p>)}
          </div>
        );
      // Other cases would follow...
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
            backgroundColor: '#F5F0E8', // Parchment color
            color: '#4f463c', // Dark brown text color
            fontFamily: '"Cinzel", serif',
            border: '2px solid #D1C7B8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
    >
      <div 
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