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
  const [isImageLoading_local, setIsImageLoading_local] = useState(false);
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('start');
  const [userProvidedName, setUserProvidedName] = useState('');
  const [userProvidedAge, setUserProvidedAge] = useState('');

  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: 'brave and kind', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [generatedName, setGeneratedName] = useState('');

  useEffect(() => {
    if (currentForgeHeroStep === 0) {
        setSharedResponse("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?");
    }
  }, [currentForgeHeroStep, setSharedResponse]);

  const generateRealImage = async (prompt) => {
    setIsImageLoading_local(true);
    setSharedResponse("The forge hums with power... a new image is being crafted!");
    
    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed on the server.');
      }
      
      const data = await response.json();
      setHeroImageUrl(data.imageUrl);
      setSharedResponse("Behold, the hero’s face shines with living light! ✨🖼️");

    } catch (error) {
      console.error("Image generation failed:", error);
      setSharedResponse("The forge has grown cold. An error occurred.");
      setHeroImageUrl(null);
    } finally {
      setIsImageLoading_local(false);
    }
  };
  
  const generateAIName = async (type) => {
    setIsNameLoading(true);
    setSharedResponse("By the power of starlight, a name is born!");
    
    try {
      const response = await fetch('/api/generateName', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, gender: heroDetails.gender }),
      });

      if (!response.ok) {
        throw new Error('Name generation failed.');
      }

      const data = await response.json();
      setGeneratedName(data.name);
      setSharedResponse(`Behold! The hero's name is ${data.name}! Do you approve?`);
    } catch (error) {
      console.error("Name generation failed:", error);
      setSharedResponse("The magical winds are silent. An error occurred.");
      setGeneratedName('');
    } finally {
      setIsNameLoading(false);
    }
  };

  const handlePhotoFileChange = async (event) => { /* ... */ };

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
  
  const handleNameChoice = (choice) => {
      if (choice === 'user_provides') {
          setCurrentQuestion('name_provide');
      } else if (choice === 'ai_suggests') {
          setCurrentQuestion('name_suggestions');
      } else {
          handleQuestionAnswer('name', 'Glimmerhart', 'age');
      }
  };

  const handleNameConfirmation = (name) => {
    handleQuestionAnswer('name', name, 'age');
    setGeneratedName('');
  };

  const constructHeroPrompt = (details) => {
    const { name, age, gender, traits, wardrobe, signatureItem } = details;
    let prompt = `${name || 'A young hero'}, a ${age || '7'}-year-old ${gender || 'child'} with ${traits || 'brave and curious'} traits, wearing ${wardrobe || 'a simple tunic and sturdy boots'}, holding ${signatureItem || 'a magical locket'}.`;
    prompt += " Style: 3D animated Film, Consistency Tag: whimsical_fantasy_child, Format: full body, front-facing. Lighting: soft cinematic. Rendered as a 3D animated film.";
    let negativePrompt = " no text, no captions, no writing, no labels, no words";
    prompt += negativePrompt;
    return prompt;
  };
  
  const handleForgeHeroSubmit = (details = heroDetails) => {
      const prompt = constructHeroPrompt(details);
      setSharedResponse("Behold, the hero’s face shines with living light!");
      generateRealImage(prompt);
      setCurrentForgeHeroStep(3);
  };

  const handleForgeHeroCompletion = () => {
    setStoryState(prev => ({
        ...prev,
        story_content: {
            ...prev.story_content,
            CharacterBlock: {
                character_details: heroDetails,
                character_image: heroImageUrl,
            }
        }
    }));
    
    // Set the transition message before changing the tab
    setSharedResponse("🎉 Your hero is forged! The first chapter of creation is complete! 🎉");
    setTimeout(() => {
      setActiveTab(1); // Move to the next tab (Spin Tale)
    }, 1500); // Wait 1.5 seconds for the message to be read
  };
  
  const choiceButtonStyle = "w-full text-left p-4 bg-black/10 border border-black/20 rounded-lg text-stone-800 hover:bg-black/20 transition-all duration-300 shadow-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  
  const renderConversationalForm = () => {
    if (generatedName) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-stone-800 text-lg font-bold">The name born of magic is:</p>
          <p className="text-4xl font-extrabold text-amber-700" style={{ fontFamily: 'Cinzel, serif' }}>{generatedName}</p>
          <button onClick={() => handleNameConfirmation(generatedName)} className={choiceButtonStyle}>Yes, that's perfect!</button>
          <button onClick={() => setGeneratedName('')} className={choiceButtonStyle}>Not quite, let's try again.</button>
        </div>
      );
    }
    
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
                                if (choice.action === 'ai_whimsical' || choice.action === 'ai_surprise') {
                                    generateAIName(choice.action.split('_')[1]);
                                } else {
                                    setCurrentQuestion(choice.action);
                                }
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
    
    if (isNameLoading) {
      setSharedResponse("By the power of starlight, a name is born!");
      return (
        <div className="flex justify-center items-center h-[200px]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-400"></div></div>
      );
    }

    switch (currentQuestion) {
      case 'name_provide':
        setSharedResponse("A wonderful choice! Please, share the name with me.");
        return (
          <div className="flex flex-col items-center space-y-4">
            <input type="text" value={userProvidedName} onChange={(e) => setUserProvidedName(e.target.value)} className="w-full p-3 rounded-lg bg-white/50 text-stone-800 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-400" placeholder="Enter hero's name..."/>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('name', userProvidedName, 'age')}>Confirm Name</button>
          </div>
        );
      case 'age_provide':
        setSharedResponse("Wonderful! How old is our hero?");
        return (
          <div className="flex flex-col items-center space-y-4">
            <input type="number" value={userProvidedAge} onChange={(e) => setUserProvidedAge(e.target.value)} className="w-full p-3 rounded-lg bg-white/50 text-stone-800 placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 border border-stone-400" placeholder="Enter hero's age..."/>
            <button className={choiceButtonStyle} onClick={() => handleQuestionAnswer('age', userProvidedAge, 'gender')}>Confirm Age</button>
          </div>
        );
      case 'traits':
        setSharedResponse("With our hero's core details captured, we are ready to forge their portrait!");
        return (
            <div className="text-center">
                <p className="text-stone-700 mb-6">All details collected! Ready to generate the hero's portrait.</p>
                <button onClick={() => handleForgeHeroSubmit()} className={`${choiceButtonStyle} text-center`} disabled={isImageLoading_local}>
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
          </div>
        );
      case 2:
          return renderConversationalForm();
      case 3:
        return (
            <div className="text-center">
              {isImageLoading_local ? (
                <div className="flex justify-center items-center h-[300px]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-400"></div></div>
              ) : heroImageUrl ? (
                <div>
                  <img src={heroImageUrl} alt="Generated Hero Portrait" className="rounded-lg shadow-2xl mb-6" />
                  <div className="space-y-4">
                    <button onClick={() => handleForgeHeroCompletion()} className={choiceButtonStyle}>Yes, that’s perfect!</button>
                    <button onClick={() => {
                        setHeroImageUrl('');
                        setCurrentForgeHeroStep(2);
                        setCurrentQuestion('name');
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
        className="w-full max-w-lg mx-auto h-full max-h-[80vh] flex flex-col p-8 rounded-lg shadow-2xl"
        style={{
            backgroundColor: 'rgba(245, 240, 232, 0.9)',
            color: '#4f463c',
            fontFamily: '"Cinzel", serif',
            border: '2px solid #D1C7B8',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
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