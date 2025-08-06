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
            CharacterBlock: { character_details: heroDetails, appearance: { visual_style: "3D animated Film", wardrobe: heroDetails.wardrobe, signature_item: heroDetails.signatureItem } },
            AssetsManifest: { hero_image_url: heroImageUrl, user_uploaded_image_url: uploadedImageUrl },
        };
        const updatedStoryData = { 
            ...(prev.story_data || {}), 
            story_title: `${heroDetails.name || 'A Hero'}'s Adventure`,
            thematic_tone: "whimsical",
            visual_style: "3D animated Film",
            visual_consistency_tag: `${heroDetails.name || 'Hero'}_whimsical_3D`,
        };
        return { ...prev, story_content: updatedStoryContent, story_data: updatedStoryData };
    });
    setActiveTab(1);
  };
  
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold";
  
  const renderConversationalForm = () => {
    switch (currentQuestion) {
      case 'name':
        setSharedResponse("And what name shall the heralds sing for this hero of ours?");
        return (
          <div className="flex flex-col items-center space-y-4">
            <button className={choiceButtonStyle} onClick={() => {
                const name = prompt("What name have you chosen?");
                handleQuestionAnswer('name', name, 'age');
            }}>1. I have a name in mind!</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('name', 'AI Suggested', 'age')}>2. I'd like you to suggest a few fitting names!</button>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('name', 'AI Surprise', 'age')}>3. Surprise me, StorySmith!</button>
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
            <button className={`${choiceButtonStyle} col-span-2`} onClick={() => handleQuestionAnswer('age', 'AI Surprise', 'gender')}>E. Surprise me, StorySmith! 🎲</button>
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
      // This is the final step of this conversational form
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
            <label htmlFor="photo-upload" className={`${choiceButtonStyle} cursor-pointer block text-center`}>
              Upload a Photograph
            </label>
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
            {heroDetails.photoFile && (<p className="mt-4 text-sm text-center text-stone-700">File selected: {heroDetails.photoFile.name}</p>)}
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
                    <button onClick={() => setCurrentForgeHeroStep(2)} className={choiceButtonStyle}>Not quite, let’s refine.</button>
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