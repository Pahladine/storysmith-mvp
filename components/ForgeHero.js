// components/ForgeHero.js

import { useState } from 'react';

// This component now encapsulates all the steps and UI for the "Forge Hero" process.
export default function ForgeHero({
  // Props it needs from the main page
  storyState,
  setStoryState,
  setActiveTab,
  isLoading,
  isImageLoading,
  generateImageSimulated // We pass down the simulation function
}) {
  // State that is ONLY used by this component can live here.
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [storyBlueprint, setStoryBlueprint] = useState({
    beginning: '', middle: '', end: '', numberOfScenes: null,
  });
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [response, setResponse] = useState("Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?"); // Initial response

  // All the helper functions from index.js that were only for forging a hero are moved here.
  const handleHeroTypeSelection = (type) => {
    setHeroDetails(prev => ({ ...prev, type }));
    if (type === 'real') {
      setCurrentForgeHeroStep(1);
      setResponse("How marvelous! A legend in the making! To truly capture their essence, would you be willing to share a photograph of our hero?");
    } else if (type === 'fictional') {
      setCurrentForgeHeroStep(2);
      setResponse("Wonderful! A hero born of pure imagination! Together, we shall give them form and heart. Let us begin!");
    } else if (type === 'surprise') {
      const simulatedHero = {
        name: "Sparklehoof", age: "6", gender: "non-binary", traits: "brave, curious, and kind",
        wardrobe: "a shimmering tunic and tiny adventurer boots", signatureItem: "a glowing mossy pebble",
      };
      setHeroDetails(simulatedHero);
      generateImageSimulated(constructHeroPrompt(simulatedHero), 'hero').then(url => setHeroImageUrl(url));
      setCurrentForgeHeroStep(3);
      setResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?");
    }
  };

  const handleHeroDetailChange = (e) => {
    const { name, value } = e.target;
    setHeroDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroDetails(prev => ({ ...prev, photoFile: file }));
      setResponse("Magnificent! I have received the image. Now, let us discover the details that a photograph can only guess at... the true heart of our hero!");
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
    setResponse(`A grand choice! Our tale shall unfold into ${num} scenes. Now, to truly chart our course, let's establish the grand arc of our adventure!`);
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
    // This function now just calls the prop to switch the tab
    setActiveTab(1);
  };

  // The return statement is the switch case from the original file.
  // Note: I'm passing the new, local `response` state to the UI elements.
  // The global response can be updated via a prop if needed, but for now, this simplifies things.
  switch (currentForgeHeroStep) {
    case 0:
      return (
        <div className="text-center">
            {/* The response is displayed in the parent component, but we can have local UI feedback here too */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => handleHeroTypeSelection('real')} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">A real person I know or love</button>
            <button onClick={() => handleHeroTypeSelection('fictional')} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">A brand new hero, born from imagination!</button>
            <button onClick={() => handleHeroTypeSelection('surprise')} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">Surprise me, StorySmith! Conjure a worthy hero for me!</button>
          </div>
        </div>
      );
    case 1:
        return (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-200">{response}</p>
            <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer" />
            {heroDetails.photoFile && (<p className="mt-4 text-sm text-gray-400">File selected: {heroDetails.photoFile.name}</p>)}
          </div>
        );
    case 2:
      return (
        <div className="space-y-4">
          <p className="text-xl text-gray-200">{response}</p>
          <div>
            <label htmlFor="heroName" className="block text-gray-300 text-sm font-bold mb-2">Hero's Name:</label>
            <input type="text" id="heroName" name="name" value={heroDetails.name} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="e.g., Sir Reginald the Brave" />
          </div>
          <div>
            <label htmlFor="heroAge" className="block text-gray-300 text-sm font-bold mb-2">Hero's Age:</label>
            <input type="number" id="heroAge" name="age" value={heroDetails.age} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="e.g., 7" />
          </div>
          <div>
            <label htmlFor="heroGender" className="block text-gray-300 text-sm font-bold mb-2">Hero's Gender:</label>
            <select id="heroGender" name="gender" value={heroDetails.gender} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600">
              <option value="">Select Gender</option>
              <option value="boy">A brave boy!</option>
              <option value="girl">A clever girl!</option>
              <option value="non-binary">A wondrous child who defies simple labels!</option>
            </select>
          </div>
          <div>
            <label htmlFor="heroTraits" className="block text-gray-300 text-sm font-bold mb-2">Defining Traits:</label>
            <input type="text" id="heroTraits" name="traits" value={heroDetails.traits} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="e.g., brave, curious, kind" />
          </div>
          <div>
            <label htmlFor="heroWardrobe" className="block text-gray-300 text-sm font-bold mb-2">Wardrobe Description:</label>
            <input type="text" id="heroWardrobe" name="wardrobe" value={heroDetails.wardrobe} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="e.g., a simple blue tunic and sturdy brown boots" />
          </div>
          <div>
            <label htmlFor="heroSignatureItem" className="block text-gray-300 text-sm font-bold mb-2">Signature Item:</label>
            <input type="text" id="heroSignatureItem" name="signatureItem" value={heroDetails.signatureItem} onChange={handleHeroDetailChange} className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="e.g., a shimmering, ancient locket" />
          </div>
          <button onClick={() => { generateImageSimulated(constructHeroPrompt(), 'hero').then(url => setHeroImageUrl(url)); setCurrentForgeHeroStep(3); setResponse("Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?"); }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300 w-full" disabled={isLoading || isImageLoading}>
            {isLoading || isImageLoading ? 'Sculpting Hero...' : 'Sculpt My Hero!'}
          </button>
        </div>
      );
    case 3:
      return (
        <div className="text-center">
            <p className="text-xl mb-6 text-gray-200">{response}</p>
            {isImageLoading ? (
              <div className="flex justify-center items-center h-[200px] bg-gray-900 rounded-lg border border-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                <p className="ml-4 text-lg text-green-400">Conjuring image...</p>
              </div>
            ) : heroImageUrl ? (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-center items-center min-h-[200px] mb-6">
                <img src={heroImageUrl} alt="Generated Hero Portrait" className="max-w-full h-auto rounded-lg shadow-lg" />
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-center items-center min-h-[200px] mb-6">
                <p className="text-gray-400">No image generated yet. Try again!</p>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button onClick={() => { setResponse("Splendid! Then it is settled. Your hero is forged! Now, let us chart the course of their grand adventure!"); setCurrentForgeHeroStep(4); }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isImageLoading}>Yes, that’s perfect, StorySmith!</button>
              <button onClick={() => { setResponse("But of course! The vision is not yet perfect! Let's refine the details."); setCurrentForgeHeroStep(2); setHeroImageUrl(''); }} className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500 transition duration-300" disabled={isImageLoading}>Not quite, let’s refine this image together.</button>
            </div>
          </div>
      );
    case 4:
      return (
        <div className="text-center">
          <p className="text-xl mb-6 text-gray-200">{response}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={() => handleNumberOfScenesSelection(3)} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">A. A delightful short tale (3 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(5)} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">B. A charming adventure (5 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(7)} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">C. An epic journey (7 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(10)} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">D. A grand saga (10 Scenes)</button>
            <button onClick={() => handleNumberOfScenesSelection(Math.floor(Math.random() * 4) * 2 + 3)} className="px-6 py-3 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition duration-300">E. Surprise me, StorySmith! 🎲</button>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="space-y-4">
          <p className="text-xl text-gray-200">{response}</p>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-indigo-300 mb-2">Beginning:</h3>
            <p className="text-gray-100 mb-4 whitespace-pre-wrap">{storyBlueprint.beginning}</p>
            <h3 className="text-lg font-bold text-indigo-300 mb-2">Middle:</h3>
            <p className="text-gray-100 mb-4 whitespace-pre-wrap">{storyBlueprint.middle}</p>
            <h3 className="text-lg font-bold text-indigo-300 mb-2">End:</h3>
            <p className="text-gray-100 mb-4 whitespace-pre-wrap">{storyBlueprint.end}</p>
            <h3 className="text-lg font-bold text-indigo-300 mb-2">Number of Scenes:</h3>
            <p className="text-gray-100">{storyBlueprint.numberOfScenes}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button onClick={handleForgeHeroCompletion} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isLoading || isImageLoading}>Yes, this blueprint is perfect!</button>
            <button onClick={() => { setResponse("Of course! A true cartographer refines their map. Let's adjust the blueprint!"); setStoryBlueprint(prev => ({ ...prev, beginning: '', middle: '', end: '', numberOfScenes: null, })); setCurrentForgeHeroStep(4); }} className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500 transition duration-300" disabled={isLoading || isImageLoading}>Not quite, let’s refine this map.</button>
          </div>
        </div>
      );
    default: return null;
  }
}