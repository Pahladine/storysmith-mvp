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
  const [isUploading, setIsUploading] = useState(false); // New state for upload status
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
          // ... surprise logic
      }
  };
  
  const handlePhotoFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setHeroDetails(prev => ({ ...prev, photoFile: file }));
    setSharedResponse("Uploading your image, please wait...");

    try {
      // Step 1: Upload the file to Vercel Blob
      const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });
      if (!uploadResponse.ok) throw new Error('Failed to upload file.');
      const newBlob = await uploadResponse.json();
      setUploadedImageUrl(newBlob.url);
      
      setSharedResponse("Upload complete! Now analyzing the image with magic...");

      // Step 2: Send the new URL to our Gemini analysis API
      const analyzeResponse = await fetch(`/api/analyzeImage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newBlob.url, imageMimeType: file.type }),
      });
      if (!analyzeResponse.ok) throw new Error('Failed to analyze image.');
      const analyzedData = await analyzeResponse.json();
      
      // Step 3: Update heroDetails with the data from Gemini
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
  
  const handleQuestionAnswer = (field, value, nextQuestion) => { /* ... */ };
  const handleNameChoice = (choice) => { /* ... */ };
  const handleForgeHeroSubmit = () => { /* ... */ };
  const constructHeroPrompt = (details = heroDetails) => { /* ... */ };
  const handleForgeHeroCompletion = () => { /* ... */ };
  
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  
  const renderConversationalForm = () => { /* ... */ };

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