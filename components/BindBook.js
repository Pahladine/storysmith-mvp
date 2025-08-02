// components/BindBook.js

import { useState, useEffect } from 'react';

// The Ledger is tightly coupled with the BindBook step, so we can define it in the same file.
const LedgerContent = ({ storyState }) => {
  const hero = storyState.story_content?.CharacterBlock?.character_details || {};
  const blueprint = storyState.story_content?.StoryBlueprintBlock?.structure || {};
  const scenes = storyState.story_content?.SceneJSON_array || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-inner">
          <h4 className="text-xl font-bold text-indigo-400 mb-3">Hero: {hero.name}</h4>
          <p className="text-gray-100 mb-4">Age: {hero.age}, Gender: {hero.gender}, Traits: {hero.traits}</p>
          {storyState.story_content?.AssetsManifest?.hero_image_url && (
            <div className="flex justify-center mb-4">
              <img src={storyState.story_content.AssetsManifest.hero_image_url} alt="Hero Portrait" className="max-w-xs h-auto rounded-lg shadow-md" />
            </div>
          )}
          <h4 className="text-xl font-bold text-indigo-400 mb-3 mt-6">Story Blueprint:</h4>
          <p className="text-gray-100 mb-2">**Beginning:** {blueprint.beginning}</p>
          <p className="text-gray-100 mb-2">**Middle:** {blueprint.middle}</p>
          <p className="text-gray-100 mb-4">**End:** {blueprint.end}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-inner">
          <h4 className="text-xl font-bold text-indigo-400 mb-3">All Scenes:</h4>
          {scenes.map((scene, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-600">
              <h5 className="text-lg font-semibold text-gray-300 mb-1">{scene.scene_title}</h5>
              <p className="text-sm text-gray-200 whitespace-pre-wrap">{scene.scene_full_text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default function BindBook({ storyState, setStoryState, setActiveTab, resetApp, generateImageSimulated, isLoading, isImageLoading, setIsLoading, setIsImageLoading }) {
  const [currentBindBookStep, setCurrentBindBookStep] = useState(0);
  const [hasStartedBindBook, setHasStartedBindBook] = useState(false);
  const [finalAuthor, setFinalAuthor] = useState('');
  const [finalDedication, setFinalDedication] = useState('');
  const [response, setResponse] = useState('');

  const hasAllScenes = storyState.story_content?.SceneJSON_array?.length > 0 && storyState.story_content?.SceneJSON_array?.length === storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes;
  const hasHeroAndBlueprint = storyState.story_content?.CharacterBlock?.character_details?.name && storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes;

  useEffect(() => {
    if (hasAllScenes && hasHeroAndBlueprint && !hasStartedBindBook) {
      setHasStartedBindBook(true);
      setResponse("A grand undertaking awaits! The time has come to bind our woven tale. Please review the Grand Ledger.");
      setCurrentBindBookStep(1);
    }
  }, [hasAllScenes, hasHeroAndBlueprint, hasStartedBindBook]);

  useEffect(() => {
    const generateAllImages = async () => {
      setIsImageLoading(true);
      setResponse("Conjuring the final visions! This may take a moment...");
      
      const updatedSceneArray = [...storyState.story_content.SceneJSON_array];
      const sceneImageUrls = [];
      for (let i = 0; i < updatedSceneArray.length; i++) {
        const imageUrl = await generateImageSimulated(updatedSceneArray[i].illustration_prompt, 'scene');
        updatedSceneArray[i].illustration_url = imageUrl;
        sceneImageUrls.push(imageUrl);
      }
      
      const coverImageUrl = await generateImageSimulated("A beautiful cover for the story.", 'cover');
      
      setStoryState(prev => ({
        ...prev,
        story_content: {
          ...prev.story_content,
          SceneJSON_array: updatedSceneArray,
          AssetsManifest: { ...prev.story_content.AssetsManifest, scene_illustration_urls: sceneImageUrls, cover_image_url: coverImageUrl },
        }
      }));
      
      setIsImageLoading(false);
      setResponse("All visions have been magnificently conjured!");
      setCurrentBindBookStep(3);
    };

    if (currentBindBookStep === 2 && !isLoading && !isImageLoading) {
      generateAllImages();
    }
  }, [currentBindBookStep, isLoading, isImageLoading]);


  if (!hasAllScenes || !hasHeroAndBlueprint) {
    return (
      <div className="text-center text-gray-200">
        <p className="text-xl mb-4">The tale is not yet fully spun!</p>
        <p>Please complete all scenes in the "Spin Tale" tab before binding your book.</p>
      </div>
    );
  }

  const handleFinalize = () => {
    setStoryState(prev => ({ ...prev, story_content: { ...prev.story_content, Cover: { author_attribution: finalAuthor, dedication: finalDedication } } }));
    setResponse("And there you have it! A legend captured, a story born of wonder and heart, now complete!");
    setCurrentBindBookStep(4);
  }

  // This prop will be displayed in the shared response box in the parent
  useEffect(() => {
    const parentResponse = document.getElementById('shared-response-box');
    if (parentResponse) parentResponse.innerText = response;
  }, [response]);

  switch (currentBindBookStep) {
    case 0:
      return <div className="text-center text-gray-200"><p>Preparing the final binding ritual...</p></div>;
    case 1: // Review Ledger
      return (
        <div className="text-center">
            <p className="text-xl mb-6 text-gray-200">Please, cast your eyes upon this chronicle. Does every detail ring true?</p>
            <div className="flex space-x-4 justify-center">
                 <button onClick={() => setCurrentBindBookStep(2)} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700">Yes, it's perfect! Conjure the images!</button>
                 <button onClick={() => setActiveTab(0)} className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500">I need to make a change.</button>
            </div>
        </div>
      );
    case 2: // Image Generation Loading
      return (
        <div className="text-center text-gray-200">
          <p className="text-xl mb-6">Conjuring the final visions! This may take a moment...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      );
    case 3: // Author & Dedication
      return (
        <div className="space-y-4">
            <p className="text-xl text-gray-200">All visions have been magnificently conjured! Now, for the final touches!</p>
            <div>
              <label htmlFor="authorAttribution" className="block text-gray-300 text-sm font-bold mb-2">By whom was this tale lovingly crafted?</label>
              <input type="text" id="authorAttribution" value={finalAuthor} onChange={(e) => setFinalAuthor(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 text-white" placeholder="Your name, or a magical pseudonym!" />
            </div>
            <div>
              <label htmlFor="dedication" className="block text-gray-300 text-sm font-bold mb-2">And for whom is this legendary book intended?</label>
              <textarea id="dedication" value={finalDedication} onChange={(e) => setFinalDedication(e.target.value)} rows="3" className="w-full p-3 rounded-lg bg-gray-800 text-white" placeholder="To my brave little adventurer..."></textarea>
            </div>
            <button onClick={handleFinalize} className="w-full px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700">Prepare for Grand Finale!</button>
        </div>
      );
    case 4: // Completion
      return (
         <div className="text-center text-gray-200">
              <p className="text-xl mb-6">Your masterpiece is ready! Our magical attraction is now complete. Farewell, dreamer!</p>
              <button onClick={resetApp} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700">Start a New Adventure!</button>
            </div>
      );
    default:
      return null;
  }
}

// We also export the Ledger content separately to be used in the parent component
export { LedgerContent };