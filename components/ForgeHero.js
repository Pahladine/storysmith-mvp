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
  const [isUploading, setIsUploading] = useState(false);
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('start');
  const [userProvidedName, setUserProvidedName] = useState('');
  const [userProvidedAge, setUserProvidedAge] = useState('');

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
  
  const handlePhotoFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setHeroDetails(prev => ({ ...prev, photoFile: file }));
    setSharedResponse("Uploading your image, please wait...");

    try {
      const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      if (!uploadResponse.ok) throw new Error('Failed to upload file.');
      const newBlob = await uploadResponse.json();
      setUploadedImageUrl(newBlob.url);
      
      setSharedResponse("Upload complete! Now analyzing the image with magic...");

      const analyzeResponse = await fetch(`/api/analyzeImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newBlob.url, imageMimeType: file.type }),
      });
      if (!analyzeResponse.ok) throw new Error('Failed to analyze image.');
      const analyzedData = await analyzeResponse.json();
      
      setHeroDetails(prev => ({
        ...prev,
        gender: analyzedData.gender || '',
        wardrobe: analyzedData.wardrobe || '',
        signatureItem: analyzedData.signature_item || '',
      }));
      
      setSharedResponse("Magnificent! I have received the vision. Now, let us discover the details that a photograph can only guess at... the true heart of our hero!");
      setCurrentForgeHeroStep(2);
      setCurrentQuestion('name');

    } catch (error) {
      console.error(error);
      setSharedResponse(`An error occurred: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };
  
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
  
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  
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
        setSharedResponse("A wonderful choice! Please, share the name with me.");
        return (
          <div className="flex flex-col items-center space-y-4">
            <input 
              type="text" 
              value={userProvidedName} 
              onChange={(e) => setUserProvidedName(e.target.value)} 
              className="w-full p-3 rounded-lg bg-white/50 text-stone-800 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-400" 
              placeholder="Enter hero's name..."
            />
            <button 
              className={choiceButtonStyle} 
              onClick={() => handleQuestionAnswer('name', userProvidedName, 'age')}
            >
              Confirm Name
            </button>
          </div>
        );
      case 'name_suggestions':
        setSharedResponse("Of course! Here are a few names that sound heroic. Do any of these sing to you?");
        return (
          <div className="flex flex-col items-center space-y-4">
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('name', 'Rowan', 'age')}>Rowan</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('name', 'Elara', 'age')}>Elara</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('name', 'Finn', 'age')}>Finn</button>
            <button className={choiceButtonStyle} onClick={() => setCurrentQuestion('name')}>None of these, let me see other options.</button>
          </div>
        );
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
        return (
            <div className="flex flex-col items-center space-y-4">
                <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('gender', 'boy', 'traits')}>1. A brave boy!</button>
                <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('gender', 'girl', 'traits')}>2. A clever girl!</button>
                <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('gender', 'non-binary', 'traits')}>3. A wondrous child!</button>
                <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('gender', 'AI Surprise', 'traits')}>4. Surprise me, StorySmith! ✨</button>
            </div>
        );
      case 'traits':
        setSharedResponse("With our hero's core details captured, we are ready to forge their portrait!");
        return (
            <div className="text-center">
                <p className="text-stone-700 mb-6">All details collected! Ready to generate the hero's portrait.</p>
                <button onClick={handleForgeHeroSubmit} className={`${choiceButtonStyle} text-center`} disabled={isImageLoading_local}>
                    {isImageLoading_local ? 'Forging Hero...' : 'Forge My Hero!'}
                </button>
            </div>
        );
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
      case 1:
        return (
          <div className="w-full">
            <label htmlFor="photo-upload" className={`${choiceButtonStyle} cursor-pointer block text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isUploading ? 'Uploading...' : 'Upload a Photograph'}
            </label>
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoFileChange} className="hidden" disabled={isUploading} />
            {heroDetails.photoFile && !isUploading && (<p className="mt-4 text-sm text-center text-stone-700">File selected: {heroDetails.photoFile.name}</p>)}
          </div>
        );
      case 2:
          return renderConversationalForm();
      case 3:
        return (
            <div className="text-center">
              {isImageLoading_local ? (
                <div className="flex justify-center items-center h-[300px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-400"></div>
                </div>
              ) : heroImageUrl ? (
                <div>
                  <img src={heroImageUrl} alt="Generated Hero Portrait" className="rounded-lg shadow-2xl mb-6" />
                  <div className="space-y-4">
                    <button onClick={() => handleForgeHeroCompletion()} className={choiceButtonStyle}>Yes, that’s perfect!</button>
                    <button onClick={() => {
                        setHeroImageUrl('');
                        setCurrentForgeHeroStep(2);
                        setCurrentQuestion('name'); // Go back to the start of the questions to refine
                    }} className={choiceButtonStyle}>Not quite, let’s refine.</button>
                  </div>
                </div>
              ) : ( <p className="text-stone-700">An error occurred during image generation.</p> )}
          </div>
        );
      default: return null;
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