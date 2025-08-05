// components/ForgeHero.js

import { useState, useEffect } from 'react';

export default function ForgeHero({
  // Props it needs from the main page
  storyState,
  setStoryState,
  setActiveTab,
  setSharedResponse,
  isLoading,
  isImageLoading
}) {
  // We now manage isImageLoading directly in this component
  const [isImageLoading_local, setIsImageLoading_local] = useState(false);
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [storyBlueprint, setStoryBlueprint] = useState({
    beginning: '', middle: '', end: '', numberOfScenes: null,
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');

  useEffect(() => {
    setSharedResponse("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?");
  }, []);

  // NEW: This function calls our own backend API route
  const generateRealImage = async (prompt) => {
    setIsImageLoading_local(true);
    setHeroImageUrl(''); // Clear previous image

    try {
      const response = await fetch('/api/generateImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        // If the server response is not OK, get the error message and throw it
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image.');
      }

      const data = await response.json();
      setHeroImageUrl(data.imageUrl); // Set the new image URL from the response

    } catch (error) {
      console.error("Error generating image:", error);
      setSharedResponse(`An error occurred: ${error.message}`); // Show error to user
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
      setSharedResponse("Wonderful! A hero born of pure imagination! Together, we shall give them form and heart. Let us begin!");
    } else if (type === 'surprise') {
      const simulatedHero = {
        name: "Sparklehoof", age: "6", gender: "non-binary", traits: "brave, curious, and kind",
        wardrobe: "a shimmering tunic and tiny adventurer boots", signatureItem: "a glowing mossy pebble",
      };
      setHeroDetails(simulatedHero);
      // Calls the new image generation function
      generateRealImage(constructHeroPrompt(simulatedHero));
      setCurrentForgeHeroStep(3);
      setSharedResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?");
    }
  };
  
  const handleForgeHeroSubmit = () => {
      const prompt = constructHeroPrompt();
      setSharedResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?");
      generateRealImage(prompt);
      setCurrentForgeHeroStep(3);
  };

  const handleHeroDetailChange = (e) => {
    const { name, value } = e.target;
    setHeroDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroDetails(prev => ({ ...prev, photoFile: file }));
      setSharedResponse("Magnificent! I have received the image. Now, let us discover the details that a photograph can only guess at... the true heart of our hero!");
      setCurrentForgeHeroStep(2);
    }
  };

  const constructHeroPrompt = (details = heroDetails) => {
    const { name, age, gender, traits, wardrobe, signatureItem } = details;
    let prompt = `${name || 'A young hero'}, a ${age || '7'}-year-old ${gender || 'child'} with ${traits || 'brave and curious'} traits, wearing ${wardrobe || 'a simple tunic and sturdy boots'}, holding ${signatureItem || 'a magical locket'}.`;
    prompt += " Style: 3D animated Film, Consistency Tag: whimsical_fantasy_child, Format: full body, front-facing. Lighting: soft cinematic. Rendered as a 3D animated film.";
    return prompt;
  };

  const handleNumberOfScenesSelection = (value) => {
    const num = parseInt(value);
    setStoryBlueprint(prev => ({ ...prev, numberOfScenes: num }));
    setSharedResponse(`A grand choice! Our tale shall unfold into ${num} scenes. Now, to truly chart our course, let's establish the grand arc of our adventure!`);
    const simulatedBeginning = `Our hero, ${heroDetails.name || 'the brave one'}, embarks on a quest to find a mystical artifact.`;
    const simulatedMiddle = `Along their journey, they face challenges, including a mischievous forest spirit and a tricky maze.`;
    const simulatedEnd = `With courage and wit, they overcome all obstacles, retrieve the artifact, and return home a true legend.`;
    setStoryBlueprint(prev => ({ ...prev, beginning: simulatedBeginning, middle: simulatedMiddle, end: simulatedEnd }));
    setCurrentForgeHeroStep(5);
  };

  const handleForgeHeroCompletion = () => {
    setStoryState(prev => {
      const updatedStoryContent = {
        ...(prev.story_content || {}),
        CharacterBlock: { ...(prev.story_content?.CharacterBlock || {}), character_details: heroDetails, appearance: { ...(prev.story_content?.CharacterBlock?.appearance || {}), visual_style: "3D animated Film", wardrobe: heroDetails.wardrobe, signature_item: heroDetails.signatureItem, }, },
        StoryBlueprintBlock: { ...(prev.story_content?.StoryBlueprintBlock || {}), structure: storyBlueprint, },
        AssetsManifest: { ...(prev.story_content?.AssetsManifest || {}), hero_image_url: heroImageUrl, },
      };
      const updatedStoryData = {
        ...(prev.story_data || {}), story_title: `${heroDetails.name || 'A Hero'}'s Adventure`, thematic_tone: "whimsical", visual_style: "3D animated Film", visual_consistency_tag: `${heroDetails.name || 'Hero'}_whimsical_3D`,
      };
      return { ...prev, story_content: updatedStoryContent, story_data: updatedStoryData };
    });
    setActiveTab(1);
  };

  // Define consistent button styles
  const primaryButtonStyle = "px-6 py-3 bg-stone-700 text-stone-100 rounded-lg shadow-md hover:bg-stone-600 border border-stone-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed";
  const secondaryButtonStyle = "px-6 py-3 bg-stone-800 text-stone-300 rounded-lg shadow-md hover:bg-stone-700 border border-stone-600 transition duration-300";

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
      return (
        <div className="space-y-4 max-w-lg mx-auto">
          {['name', 'age', 'gender', 'traits', 'wardrobe', 'signatureItem'].map((detail) => (
            <div key={detail}>
              <label htmlFor={detail} className="block text-stone-300 text-sm font-bold mb-2 capitalize">{detail.replace(/([A-Z])/g, ' $1')}:</label>
              {detail === 'gender' ? (
                <select id={detail} name={detail} value={heroDetails[detail]} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-900/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-600">
                  <option value="">Select Gender</option>
                  <option value="boy">A brave boy!</option>
                  <option value="girl">A clever girl!</option>
                  <option value="non-binary">A wondrous child!</option>
                </select>
              ) : (
                <input type={detail === 'age' ? 'number' : 'text'} id={detail} name={detail} value={heroDetails[detail]} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-900/70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-stone-600" />
              )}
            </div>
          ))}
          <button onClick={handleForgeHeroSubmit} className={`${primaryButtonStyle} w-full`} disabled={isImageLoading_local}>
            {isImageLoading_local ? 'Forging Hero...' : 'Forge My Hero!'}
          </button>
        </div>
      );
    case 3:
      return (
        <div className="text-center">
            {isImageLoading_local ? (
              <div className="flex justify-center items-center h-[200px] bg-gray-900/50 rounded-lg border border-stone-700">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-400"></div>
                <p className="ml-4 text-lg text-stone-300">Conjuring image...</p>
              </div>
            ) : heroImageUrl ? (
              <div className="bg-gray-900/50 border border-stone-700 rounded-lg p-4 flex justify-center items-center min-h-[200px] mb-6">
                <img src={heroImageUrl} alt="Generated Hero Portrait" className="max-h-[36rem] w-auto rounded-lg shadow-lg" />
              </div>
            ) : ( <div className="bg-gray-900/50 border border-stone-700 rounded-lg p-4 flex justify-center items-center min-h-[200px] mb-6"><p className="text-stone-400">An error occurred, or no image was generated.</p></div> )}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => { setSharedResponse("Splendid! Then it is settled. Your hero is forged! Now, let us chart the course of their grand adventure!"); setCurrentForgeHeroStep(4); }} className={primaryButtonStyle} disabled={isImageLoading_local}>Yes, that’s perfect!</button>
              <button onClick={() => { setSharedResponse("But of course! The vision is not yet perfect! Let's refine the details."); setCurrentForgeHeroStep(2); setHeroImageUrl(''); }} className={secondaryButtonStyle} disabled={isImageLoading_local}>Not quite, let’s refine.</button>
            </div>
          </div>
      );
    case 4:
      return (
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => handleNumberOfScenesSelection(3)} className={primaryButtonStyle}>A. A short tale (3 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(5)} className={primaryButtonStyle}>B. An adventure (5 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(7)} className={primaryButtonStyle}>C. An epic journey (7 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(10)} className={primaryButtonStyle}>D. A grand saga (10 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(Math.floor(Math.random() * 4) * 2 + 3)} className={`${primaryButtonStyle} md:col-span-2 lg:col-span-1`}>E. Surprise me, StorySmith! 🎲</button>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="space-y-4">
          <div className="bg-gray-900/70 rounded-lg p-6 border border-stone-700">
            <h3 className="text-lg font-bold text-stone-200 mb-2">Beginning:</h3>
            <p className="text-stone-300 mb-4 whitespace-pre-wrap">{storyBlueprint.beginning}</p>
            <h3 className="text-lg font-bold text-stone-200 mb-2">Middle:</h3>
            <p className="text-stone-300 mb-4 whitespace-pre-wrap">{storyBlueprint.middle}</p>
            <h3 className="text-lg font-bold text-stone-200 mb-2">End:</h3>
            <p className="text-stone-300 mb-4 whitespace-pre-wrap">{storyBlueprint.end}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button onClick={handleForgeHeroCompletion} className={primaryButtonStyle} disabled={isLoading}>This blueprint is perfect!</button>
            <button onClick={() => { setSharedResponse("A true cartographer refines their map!"); setStoryBlueprint(prev => ({ ...prev, beginning: '', middle: '', end: '', numberOfScenes: null, })); setCurrentForgeHeroStep(4); }} className={secondaryButtonStyle} disabled={isLoading}>Let’s refine this map.</button>
          </div>
        </div>
      );
    default: return null;
  }
}