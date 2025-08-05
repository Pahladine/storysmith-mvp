// components/ForgeHero.js

import { useState, useEffect } from 'react';

export default function ForgeHero({
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
  isLoading,
}) {
  const [isImageLoading_local, setIsImageLoading_local] = useState(false);
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  
  // NEW STATE to track the current question in the sequence
  const [currentQuestion, setCurrentQuestion] = useState('start');

  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [storyBlueprint, setStoryBlueprint] = useState({
    beginning: '', middle: '', end: '', numberOfScenes: null,
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
      setCurrentForgeHeroStep(2); // Move to the conversational form step
      setCurrentQuestion('name'); // Start with the first question
      setSharedResponse("Wonderful! A hero born of pure imagination! Together, we shall give them form and heart. Let us begin!");
    } else if (type === 'surprise') {
      const simulatedHero = {
        name: "Sparklehoof", age: "6", gender: "non-binary", traits: "brave, curious, and kind",
        wardrobe: "a shimmering tunic and tiny adventurer boots", signatureItem: "a glowing mossy pebble",
      };
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
      setCurrentForgeHeroStep(2); // Move to the conversational form step
      setCurrentQuestion('name'); // Start the questions after upload

    } catch (error) {
      console.error(error);
      setSharedResponse(`An error occurred during upload: ${error.message}`);
    }
  };
  
  // This function now handles advancing the conversation
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
      // ... (rest of the completion logic remains the same)
    });
    setActiveTab(1);
  };
  
  const primaryButtonStyle = "px-6 py-3 bg-stone-700 text-stone-100 rounded-lg shadow-md hover:bg-stone-600 border border-stone-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // RENDER LOGIC FOR THE CONVERSATIONAL FORM
  const renderConversationalForm = () => {
    switch (currentQuestion) {
      case 'name':
        setSharedResponse("And what name shall the heralds sing for this hero of ours?");
        return (
          <div className="flex flex-col items-center space-y-4">
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('name', 'User Defined', 'age')}>I have a name in mind!</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('name', 'AI Suggested', 'age')}>I'd like you to suggest a few fitting names!</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('name', 'AI Whimsical', 'age')}>Let's make up a whimsical fantasy name together!</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('name', 'AI Surprise', 'age')}>Surprise me, StorySmith — conjure one from the stars!</button>
          </div>
        );
      case 'age':
        setSharedResponse("How many years has our hero adventured?");
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('age', '4', 'gender')}>A. 4 years old</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('age', '5', 'gender')}>B. 5 years old</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('age', '6', 'gender')}>C. 6 years old</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('age', '7', 'gender')}>D. 7 years old</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('age', '8', 'gender')}>E. 8 years old</button>
            <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('age', '9', 'gender')}>F. 9 years old</button>
            <button className={`${primaryButtonStyle} col-span-2`} onClick={() => handleQuestionAnswer('age', 'AI Surprise', 'gender')}>G. Surprise me, StorySmith! 🎲</button>
          </div>
        );
      case 'gender':
        setSharedResponse("And how shall we refer to our hero?");
        return (
            <div className="flex flex-col items-center space-y-4">
                <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('gender', 'boy', 'traits')}>A brave boy!</button>
                <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('gender', 'girl', 'traits')}>A clever girl!</button>
                <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('gender', 'non-binary', 'traits')}>A wondrous child who defies simple labels!</button>
                <button className={primaryButtonStyle} onClick={() => handleQuestionAnswer('gender', 'AI Surprise', 'traits')}>Surprise me, StorySmith! ✨</button>
            </div>
        );
        // ... Add more cases here for 'traits', 'wardrobe', 'signatureItem' in the same pattern
        // For now, we'll end here and proceed to the final step
      default:
        // This is where the old form would have been, now it's the end of the conversation
        setSharedResponse("With our hero's core details captured, we are ready to forge their portrait!");
        return (
            <div className="text-center">
                <p className="text-stone-300 mb-6">All details collected! Ready to generate the hero's portrait.</p>
                <button onClick={handleForgeHeroSubmit} className={`${primaryButtonStyle} w-full max-w-sm mx-auto`} disabled={isImageLoading_local}>
                    {isImageLoading_local ? 'Forging Hero...' : 'Forge My Hero!'}
                </button>
            </div>
        );
    }
  }


  switch (currentForgeHeroStep) {
    case 0:
      return (
        <div className="text-center">
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => handleHeroTypeSelection('real')} className={primaryButtonStyle}>A real person I know or love</button>
            <button onClick={() => handleHeroTypeSelection('fictional')} className={primaryButtonStyle}>A brand new hero, born from imagination!</button>
            <button onClick={() => handleHeroTypeSelection('surprise')} className={primaryButtonStyle}>Surprise me, StorySmith!</button>
          </div>
        </div>
      );
    case 1:
        return (
          <div className="text-center">
            <label htmlFor="photo-upload" className={`${primaryButtonStyle} cursor-pointer`}>
              Upload a Photograph
            </label>
            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoFileChange} className="hidden" />
            {heroDetails.photoFile && (<p className="mt-4 text-sm text-stone-300">File selected: {heroDetails.photoFile.name}</p>)}
          </div>
        );
    case 2:
      // This step now renders our new conversational form
      return renderConversationalForm();
    
    // Cases 3, 4, 5 for showing the image and completing the process remain mostly the same
    case 3:
      return (
        <div className="text-center">
            {/* Image display logic... */}
        </div>
      );
    // ... other cases
    default: return null;
  }
}