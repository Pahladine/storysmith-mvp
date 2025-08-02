// components/SpinTale.js

import { useState, useEffect } from 'react';

export default function SpinTale({ storyState, setStoryState, setActiveTab, isLoading, isImageLoading }) {
  const [currentSpinTaleStep, setCurrentSpinTaleStep] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [hasStartedSpinTale, setHasStartedSpinTale] = useState(false);
  const [response, setResponse] = useState('');

  const hasBlueprintData = storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes > 0;
  const hasHeroData = storyState.story_content?.CharacterBlock?.character_details?.name;

  const generateAndDisplayScene = (sceneNum, totalScenes, hero) => {
    const heroName = hero.name || 'the brave hero';
    let sceneText = "";
    let sceneTitle = "";

    // Simplified scene generation logic
    if (sceneNum === 1) {
      sceneTitle = "The Call to Adventure";
      sceneText = `Scene 1: The Call to Adventure. Our hero, ${heroName}, stands at the edge of a whispering forest, the morning sun dappling through the leaves. A strange, shimmering light pulses from within the deepest part of the woods, beckoning them forward.`;
    } else if (sceneNum === totalScenes) {
      sceneTitle = "The Grand Return";
      sceneText = `Scene ${sceneNum}: The Grand Return. After their arduous journey, ${heroName}, emerges from the final challenge, triumphant. The weight of their quest lifts, replaced by a profound sense of accomplishment.`;
    } else {
      sceneTitle = `Scene ${sceneNum}: A New Challenge`;
      sceneText = `Scene ${sceneNum}: A New Challenge. The journey continues for ${heroName}. They venture deeper into the unknown, facing unexpected twists and turns.`;
    }

    setResponse(`Behold, the tale of Scene ${sceneNum} unfolds before us! Does this passage capture the magic and adventure you envision?`);
    setStoryState(prev => {
      const newScene = {
        scene_id: sceneNum,
        scene_title: sceneTitle,
        scene_status: "pending_illustration",
        scene_full_text: sceneText,
        illustration_prompt: `An illustration for "${sceneTitle}" featuring ${heroName}. Style: ${prev.story_data?.visual_style || "3D animated Film"}`,
        illustration_url: null,
      };
      const updatedSceneArray = [...(prev.story_content?.SceneJSON_array || [])];
      const existingSceneIndex = updatedSceneArray.findIndex(s => s.scene_id === sceneNum);
      if (existingSceneIndex !== -1) {
        updatedSceneArray[existingSceneIndex] = newScene;
      } else {
        updatedSceneArray.push(newScene);
      }
      return { ...prev, story_content: { ...(prev.story_content || {}), SceneJSON_array: updatedSceneArray } };
    });
    setCurrentSpinTaleStep(1);
  };

  useEffect(() => {
    if (hasBlueprintData && hasHeroData && !hasStartedSpinTale && storyState.story_content.SceneJSON_array.length === 0) {
      setHasStartedSpinTale(true);
      setResponse("Wonderful! With our hero forged in starlight, let us begin to spin their legendary tale!");
      setTimeout(() => {
        generateAndDisplayScene(1, storyState.story_content.StoryBlueprintBlock.structure.numberOfScenes, storyState.story_content.CharacterBlock.character_details);
      }, 1500);
    }
  }, [hasBlueprintData, hasHeroData, hasStartedSpinTale, storyState]);

  if (!hasBlueprintData || !hasHeroData) {
    return (
      <div className="text-center text-gray-200">
        <p className="text-xl mb-4">It seems our story's hero or blueprint is not yet forged!</p>
        <p>Please return to the "Forge Hero" tab to begin your adventure.</p>
      </div>
    );
  }

  const totalScenes = storyState.story_content.StoryBlueprintBlock.structure.numberOfScenes;
  const hero = storyState.story_content.CharacterBlock.character_details;
  const currentScene = storyState.story_content.SceneJSON_array[currentSceneIndex];

  switch (currentSpinTaleStep) {
    case 0:
      return (
        <div className="text-center">
          <p className="text-xl mb-6 text-gray-200">Preparing to spin the tale...</p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      );
    case 1:
      if (!currentScene) {
        return (
          <div className="text-center text-gray-200">
            <p className="text-xl mb-4">Generating scene...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        );
      }
      return (
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {storyState.story_content.SceneJSON_array.slice(0, currentSceneIndex).map((scene, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600 opacity-75">
                <h4 className="text-lg font-semibold text-gray-300 mb-2">{scene.scene_title}</h4>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{scene.scene_full_text}</p>
              </div>
            ))}
          </div>
          <h3 className="text-2xl font-semibold text-indigo-300 mb-4 text-center">Current: {currentScene.scene_title}</h3>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 min-h-[150px]">
            <p className="whitespace-pre-wrap text-base leading-relaxed text-gray-100">{currentScene.scene_full_text}</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex justify-center items-center min-h-[200px] mb-6">
            <p className="text-gray-400">Scene Illustration Placeholder</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button onClick={() => {
              const nextSceneIndex = currentSceneIndex + 1;
              if (nextSceneIndex < totalScenes) {
                setCurrentSceneIndex(nextSceneIndex);
                generateAndDisplayScene(nextSceneIndex + 1, totalScenes, hero);
              } else {
                setActiveTab(2);
              }
            }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isLoading || isImageLoading}>
              Yes, this scene is perfect!
            </button>
            <button className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500 transition duration-300" disabled={isLoading || isImageLoading}>
              Not quite, let’s refine this scene.
            </button>
          </div>
        </div>
      );
    default:
      return null;
  }
}