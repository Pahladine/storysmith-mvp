import Script from 'next/script';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import LandingPage from '../components/LandingPage';

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState('');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [storyState, setStoryState] = useState({
    metadata: {},
    user_info: {},
    story_data: {
      story_title: "",
      thematic_tone: null,
      visual_style: "3D animated Film",
      visual_consistency_tag: null
    },
    story_content: {
      CharacterBlock: {},
      StoryBlueprintBlock: {},
      SceneJSON_array: [],
      AssetsManifest: {
        scene_illustration_urls: [],
        cover_image_url: null,
        hero_image_url: null,
      },
      Cover: {}
    }
  });
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [currentForgeHeroStep, setCurrentForgeHeroStep] = useState(0);
  const [currentSpinTaleStep, setCurrentSpinTaleStep] = useState(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [hasStartedSpinTale, setHasStartedSpinTale] = useState(false);
  const [currentBindBookStep, setCurrentBindBookStep] = useState(0);
  const [hasStartedBindBook, setHasStartedBindBook] = useState(false);
  const [finalAuthor, setFinalAuthor] = useState('');
  const [finalDedication, setFinalDedication] = useState('');
  const [heroDetails, setHeroDetails] = useState({
    type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null,
  });
  const [storyBlueprint, setStoryBlueprint] = useState({
    beginning: '', middle: '', end: '', numberOfScenes: null,
  });
  // --- NEW ADMIN STATE ---
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'your_secret_password';

  const tabs = [
    { label: 'Forge Hero', endpoint: 'forge-hero' },
    { label: 'Spin Tale', endpoint: 'scene-weaver' },
    { label: 'Bind Book', endpoint: 'bind-book' },
  ];

  // --- API & SIMULATION FUNCTIONS ---
  const handleApiCall = async (endpoint, args) => {
    setIsLoading(true);
    setResponse('Loading...');
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      setResponse(data.reply || 'No reply');
      if (data.storyState && Object.keys(data.storyState).length > 0) {
        setStoryState(prev => ({ ...prev, ...data.storyState }));
      }
    } catch (error) {
      console.error("API call failed:", error);
      setResponse('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      try {
        const res = await fetch('/api/subscribe-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message);
          setEmail('');
        } else {
          alert(data.message || 'Failed to subscribe. Please try again.');
        }
      } catch (error) {
        console.error("Subscription failed:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === password) {
      setShowLandingPage(false);
      setShowPasswordInput(false);
      setAdminPasswordInput('');
    } else {
      alert('Incorrect password!');
      setAdminPasswordInput('');
    }
  };

  const generateImageSimulated = async (prompt, type = 'scene') => {
    setIsImageLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const safePrompt = prompt || `A beautiful ${type} illustration`;
    const placeholderText = encodeURIComponent(safePrompt.substring(0, 20) + '...');
    let imageUrl;
    if (type === 'hero') {
      imageUrl = `https://placehold.co/300x300/8B5CF6/FFFFFF?text=Hero+${placeholderText}`;
    } else if (type === 'cover') {
      imageUrl = `https://placehold.co/400x600/FF6347/FFFFFF?text=Cover+${placeholderText}`;
    } else {
      imageUrl = `https://placehold.co/400x300/3CB371/FFFFFF?text=Scene+${placeholderText}`;
    }
    setIsImageLoading(false);
    return imageUrl;
  };

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

  const generateAndDisplayScene = (sceneNum, totalScenes, hero, blueprint) => {
    const heroName = hero.name || 'the brave hero';
    let sceneText = "";
    let sceneTitle = "";
    if (sceneNum === 1) {
      sceneTitle = "The Call to Adventure";
      sceneText = `Scene 1: The Call to Adventure. Our hero, ${heroName}, stands at the edge of a whispering forest, the morning sun dappling through the leaves. A strange, shimmering light pulses from within the deepest part of the woods, beckoning them forward. The air is cool and smells of damp earth and pine needles. A faint, melodic hum vibrates through the ground beneath their feet.`;
    } else if (sceneNum === totalScenes) {
      sceneTitle = "The Grand Return";
      sceneText = `Scene ${sceneNum}: The Grand Return. After their arduous journey, ${heroName}, emerges from the final challenge, triumphant. The weight of their quest lifts, replaced by a profound sense of accomplishment. The sound of distant cheers reaches their ears, warm and inviting. A gentle breeze carries the sweet scent of home.`;
    } else if (sceneNum === 2 && totalScenes > 3) {
      sceneTitle = "The First Obstacle";
      sceneText = `Scene 2: The First Obstacle. Following the mysterious light, ${heroName}, stumbles upon a gnarled, ancient tree whose branches twist like arms. A grumpy, moss-covered troll blocks their path, demanding a riddle be solved. The air grows heavy with the troll's gruff voice, and the rough bark of the tree feels cold against their hand as they lean in to listen.`;
    } else if (sceneNum === 3 && totalScenes > 5) {
      sceneTitle = "A Moment of Reflection";
      sceneText = `Scene 3: A Moment of Reflection. After narrowly escaping the troll, ${heroName}, finds a quiet clearing bathed in moonlight. They sit by a babbling brook, its gentle gurgle a soothing sound. The cool, smooth stones of the bank offer a brief respite, and the sweet scent of night-blooming jasmine fills the air as they ponder their next move.`;
    } else {
      sceneTitle = `Scene ${sceneNum}: A New Challenge`;
      sceneText = `Scene ${sceneNum}: A New Challenge. The journey continues for ${heroName}. They venture deeper into the unknown, facing unexpected twists and turns. The sounds of the wilderness surround them, and the ground beneath their feet changes with every step.`;
    }
    setResponse(`Behold, the tale of Scene ${sceneNum} unfolds before us! Does this passage capture the magic and adventure you envision?`);
    setStoryState(prev => {
      const newScene = {
        scene_id: sceneNum, scene_title: sceneTitle, scene_status: "pending_illustration",
        scene_full_text: sceneText, illustration_prompt: `An illustration for "${sceneTitle}" featuring ${heroName} in this setting: ${sceneText.substring(0, 100)}... Style: ${prev.story_data?.visual_style || "3D animated Film"}, Consistency Tag: ${prev.story_data?.visual_consistency_tag || ""}`,
        illustration_url: null, continuity_notes: [],
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

  // --- useEffect HOOKS ---
  useEffect(() => {
    if (activeTab === 1) {
      const hasBlueprintData = storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes > 0;
      const hasHeroData = storyState.story_content?.CharacterBlock?.character_details?.name;
      if (hasBlueprintData && hasHeroData && currentSceneIndex === 0 && !isLoading && !isImageLoading && !hasStartedSpinTale) {
        if (storyState.story_content.SceneJSON_array.length === 0) {
          setHasStartedSpinTale(true);
          setResponse("Wonderful! With our hero forged in starlight, let us re-align with our grand purpose and begin to spin their legendary tale!");
          setTimeout(() => {
            generateAndDisplayScene(1, storyState.story_content.StoryBlueprintBlock.structure.numberOfScenes, storyState.story_content.CharacterBlock.character_details, storyState.story_content.StoryBlueprintBlock.structure);
          }, 1500);
        }
      }
    } else {
      if (hasStartedSpinTale) setHasStartedSpinTale(false);
    }
  }, [activeTab, storyState, currentSpinTaleStep, currentSceneIndex, isLoading, isImageLoading, hasStartedSpinTale]);

  useEffect(() => {
    if (activeTab === 2) {
      const hasAllScenes = storyState.story_content?.SceneJSON_array?.length === storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes;
      const hasHeroAndBlueprint = storyState.story_content?.CharacterBlock?.character_details?.name && storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes;
      if (hasAllScenes && hasHeroAndBlueprint && !hasStartedBindBook && !isLoading && !isImageLoading) {
        setHasStartedBindBook(true);
        setResponse("A grand undertaking awaits, brave co-creator! The time has come to bind our woven tale, for the legend hungers for its cover!");
        setCurrentBindBookStep(1);
      }
    } else {
      if (hasStartedBindBook) setHasStartedBindBook(false);
    }
  }, [activeTab, storyState, isLoading, isImageLoading, hasStartedBindBook]);

  useEffect(() => {
    if (activeTab === 2 && currentBindBookStep === 2 && !isLoading && !isImageLoading) {
      const generateAllImages = async () => {
        setIsImageLoading(true);
        setResponse("Conjuring the final visions! This may take a moment as I weave shimmering light into magnificent illustrations for every scene, and for our book's grand cover!");
        const updatedSceneArray = [...(storyState.story_content?.SceneJSON_array || [])];
        for (let i = 0; i < updatedSceneArray.length; i++) {
          const scene = updatedSceneArray[i];
          const imageUrl = await generateImageSimulated(scene.illustration_prompt, 'scene');
          updatedSceneArray[i] = { ...scene, illustration_url: imageUrl };
          setResponse(`Scene ${scene.scene_id} illustration conjured!`);
        }
        const coverImageUrl = await generateImageSimulated(storyState.story_content?.Cover?.cover_image_prompt, 'cover');
        setStoryState(prev => ({
          ...prev, story_content: {
            ...prev.story_content, SceneJSON_array: updatedSceneArray,
            AssetsManifest: { ...prev.story_content.AssetsManifest, scene_illustration_urls: updatedSceneArray.map(s => s.illustration_url), cover_image_url: coverImageUrl },
            Cover: { ...prev.story_content.Cover, cover_image_url: coverImageUrl }
          }
        }));
        setIsImageLoading(false);
        setResponse("All visions have been magnificently conjured! Every scene, every detail, and the glorious cover now gleam with their true form! We are ready for the grand binding!");
        setCurrentBindBookStep(3);
      };
      if (storyState.story_content?.AssetsManifest?.scene_illustration_urls?.length === 0 && storyState.story_content?.AssetsManifest?.cover_image_url === null) {
        generateAllImages();
      } else if (currentBindBookStep === 2) {
        setCurrentBindBookStep(3);
      }
    }
  }, [activeTab, currentBindBookStep, isLoading, isImageLoading, storyState]);

  // --- RENDER LOGIC ---
  const renderForgeHeroContent = () => {
    switch (currentForgeHeroStep) {
      case 0:
        return (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-200">
              Welcome, brave adventurer! To begin our grand tale, tell me, from where shall our hero emerge?
            </p>
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
            <p className="text-xl mb-6 text-gray-200">Please, lend your magic and upload a photograph of our hero!</p>
            <input type="file" accept="image/*" onChange={handlePhotoFileChange} className="block w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600 cursor-pointer" />
            {heroDetails.photoFile && (<p className="mt-4 text-sm text-gray-400">File selected: {heroDetails.photoFile.name}</p>)}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-xl text-gray-200">Now, let's sculpt the very essence of our hero!</p>
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
            <button onClick={() => { generateImageSimulated(constructHeroPrompt(), 'hero').then(url => setHeroImageUrl(url)); setCurrentForgeHeroStep(3); }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300 w-full" disabled={isLoading || isImageLoading}>
              {isLoading || isImageLoading ? 'Sculpting Hero...' : 'Sculpt My Hero!'}
            </button>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-200">Behold, the hero’s face shines with living light! Does this portrait sing true to your vision, brave creator?</p>
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
            <p className="text-xl mb-6 text-gray-200">Now, brave creator, how many scenes shall our magnificent tale unfold into?</p>
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
            <p className="text-xl text-gray-200">Behold, the grand map of our adventure! Does this blueprint guide our tale true?</p>
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
              <button onClick={() => {
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
                  return { ...prev, story_content: updatedStoryContent, story_data: updatedStoryData, };
                });
                setResponse("🎉 Your hero is forged! The first chapter of creation is complete! Now, let's spin the tale!");
                setActiveTab(1); setCurrentForgeHeroStep(0); setHeroImageUrl(''); setHeroDetails({ type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null, }); setStoryBlueprint({ beginning: '', middle: '', end: '', numberOfScenes: null, });
              }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isLoading || isImageLoading}>Yes, this blueprint is perfect!</button>
              <button onClick={() => { setResponse("Of course! A true cartographer refines their map. Let's adjust the blueprint!"); setStoryBlueprint(prev => ({ ...prev, beginning: '', middle: '', end: '', numberOfScenes: null, })); setCurrentForgeHeroStep(4); }} className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500 transition duration-300" disabled={isLoading || isImageLoading}>Not quite, let’s refine this map.</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderSpinTaleContent = () => {
    const hasBlueprintData = storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes > 0;
    const hasHeroData = storyState.story_content?.CharacterBlock?.character_details?.name;
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
    const blueprint = storyState.story_content.StoryBlueprintBlock.structure;
    switch (currentSpinTaleStep) {
      case 0:
        return (
          <div className="text-center">
            <p className="text-xl mb-6 text-gray-200">Wonderful! With our hero forged in starlight, let us re-align with our grand purpose and begin to spin their legendary tale!</p>
            <button onClick={() => { generateAndDisplayScene(1, totalScenes, hero, blueprint); }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isLoading || isImageLoading}>Begin Scene 1!</button>
          </div>
        );
      case 1:
        const currentScene = storyState.story_content.SceneJSON_array[currentSceneIndex];
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
                <div key={scene.scene_id || `prev-scene-${idx}`} className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-600 opacity-75">
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
                  setResponse(`Scene ${currentScene.scene_id} approved! Onward to Scene ${nextSceneIndex + 1}!`);
                  setCurrentSceneIndex(nextSceneIndex);
                  generateAndDisplayScene(nextSceneIndex + 1, totalScenes, hero, blueprint);
                } else {
                  setResponse("🎉 All scenes are woven! The tale is complete! Now, let's bind our magnificent book!");
                  setActiveTab(2); setCurrentSpinTaleStep(0); setCurrentSceneIndex(0);
                }
              }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isLoading || isImageLoading}>Yes, this scene is perfect!</button>
              <button onClick={() => { setResponse("Not quite, let's refine this scene together. What would you like to change?"); }} className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500 transition duration-300" disabled={isLoading || isImageLoading}>Not quite, let’s refine this scene together.</button>
            </div>
          </div>
        );
      default: return null;
    }
  };

  const renderLedgerContent = (storyState) => {
    const hero = storyState.story_content?.CharacterBlock?.character_details || {};
    const blueprint = storyState.story_content?.StoryBlueprintBlock?.structure || {};
    const scenes = storyState.story_content?.SceneJSON_array || [];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-inner">
            <h4 className="text-xl font-bold text-indigo-400 mb-3">Hero: {hero.name}</h4>
            <p className="text-gray-100 mb-4">Age: {hero.age}, Gender: {hero.gender}, Traits: {hero.traits}</p>
            <p className="text-gray-100 mb-4">Wardrobe: {storyState.story_content?.CharacterBlock?.appearance?.wardrobe}, Signature Item: {storyState.story_content?.CharacterBlock?.appearance?.signature_item}</p>
            {storyState.story_content?.AssetsManifest?.hero_image_url && (
              <div className="flex justify-center mb-4">
                <img src={storyState.story_content.AssetsManifest.hero_image_url} alt="Hero Portrait" className="max-w-xs h-auto rounded-lg shadow-md" />
              </div>
            )}
            <h4 className="text-xl font-bold text-indigo-400 mb-3 mt-6">Story Blueprint:</h4>
            <p className="text-gray-100 mb-2">**Beginning:** {blueprint.beginning}</p>
            <p className="text-gray-100 mb-2">**Middle:** {blueprint.middle}</p>
            <p className="text-gray-100 mb-4">**End:** {blueprint.end}</p>
            <p className="text-gray-100 mb-4">Total Scenes: {blueprint.numberOfScenes}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 shadow-inner overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
            <h4 className="text-xl font-bold text-indigo-400 mb-3">All Scenes:</h4>
            {scenes.map((scene, idx) => (
              <div key={scene.scene_id || `ledger-scene-${idx}`} className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-600">
                <h5 className="text-lg font-semibold text-gray-300 mb-1">{scene.scene_title}</h5>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{scene.scene_full_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBindBookContent = () => {
    const hasAllScenes = storyState.story_content?.SceneJSON_array?.length === storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes;
    const hasHeroAndBlueprint = storyState.story_content?.CharacterBlock?.character_details?.name && storyState.story_content?.StoryBlueprintBlock?.structure?.numberOfScenes;
    if (!hasAllScenes || !hasHeroAndBlueprint) {
      return (
        <div className="text-center text-gray-200">
          <p className="text-xl mb-4">The tale is not yet fully spun!</p>
          <p>Please complete all scenes in the "Spin Tale" tab before binding your book.</p>
        </div>
      );
    }
    switch (currentBindBookStep) {
      case 0:
        return (
          <div className="text-center text-gray-200">
            <p className="text-xl mb-6">Preparing the final binding ritual...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-xl text-gray-200 mb-6">Please, cast your eyes upon this chronicle. Does every detail ring true to your heart's vision?</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
              <button onClick={() => { setResponse("Magnificent! The ledger is approved! Now, let us conjure the final illustrations and bind this legend forever!"); setCurrentBindBookStep(2); }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300" disabled={isLoading || isImageLoading}>Yes, it's absolutely perfect! Let us conjure our images!</button>
              <button onClick={() => { setResponse("I'vespotted a little detail I'd like to refine. Please tell me what needs adjusting."); setActiveTab(0); setCurrentForgeHeroStep(0); setCurrentBindBookStep(0); }} className="px-6 py-3 bg-gray-600 rounded-lg text-gray-200 font-semibold shadow-md hover:bg-gray-500 transition duration-300" disabled={isLoading || isImageLoading}>I've spotted a little detail I'd like to refine.</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="text-center text-gray-200">
            <p className="text-xl mb-6">Conjuring the final visions! This may take a moment...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-lg text-indigo-400">Generating illustrations...</p>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-xl text-gray-200">All visions have been magnificently conjured! Now, for the final touches!</p>
            <div>
              <label htmlFor="authorAttribution" className="block text-gray-300 text-sm font-bold mb-2">By whom was this tale lovingly crafted?</label>
              <input type="text" id="authorAttribution" name="authorAttribution" value={finalAuthor} onChange={(e) => setFinalAuthor(e.target.value)} className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="Your name, or a magical pseudonym!" />
            </div>
            <div>
              <label htmlFor="dedication" className="block text-gray-300 text-sm font-bold mb-2">And for whom is this legendary book intended?</label>
              <textarea id="dedication" name="dedication" value={finalDedication} onChange={(e) => setFinalDedication(e.target.value)} rows="3" className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-600" placeholder="To my brave little adventurer..."></textarea>
            </div>
            <button onClick={() => {
              setStoryState(prev => ({ ...prev, story_content: { ...(prev.story_content || {}), Cover: { ...(prev.story_content?.Cover || {}), author_attribution: finalAuthor, dedication: finalDedication, } } }));
              setResponse("And now, the grand finale draws near! Your masterpiece awaits its final binding!");
              setCurrentBindBookStep(4);
            }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300 w-full" disabled={isLoading || isImageLoading}>Prepare for Grand Finale!</button>
            </div>
          );
        case 4:
          return (
            <div className="text-center text-gray-200">
              <p className="text-xl mb-6">And there you have it! A legend captured, a story born of wonder and heart, now complete with every vibrant illustration and glorious cover! May it bring immense joy to the one for whom it was crafted. Our magical attraction is now complete. Farewell, dreamer!</p>
              <p className="text-lg mb-6">Your masterpiece is ready! (Download links would appear here in a real app)</p>
              <button onClick={() => { setActiveTab(0); setCurrentForgeHeroStep(0); setCurrentSpinTaleContent(0); setCurrentBindBookContent(0); setHeroImageUrl(''); setHeroDetails({ type: '', name: '', age: '', gender: '', traits: '', wardrobe: '', signatureItem: '', photoFile: null, }); setStoryBlueprint({ beginning: '', middle: '', end: '', numberOfScenes: null, }); setFinalAuthor(''); setFinalDedication(''); setShowLandingPage(true); }} className="px-6 py-3 bg-indigo-600 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-700 transition duration-300">Start a New Adventure!</button>
            </div>
          );
        default: return null;
      }
    };
  
    const renderAppInterface = () => (
      <div className="min-h-screen flex flex-col bg-gray-800 text-white" style={{fontFamily: 'Lato, sans-serif'}}>
        <header className="bg-gray-900 py-4 shadow-lg">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400" style={{ fontFamily: 'Cinzel, serif' }}>StorySmith</h1>
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" onClick={(e) => {e.preventDefault(); setShowLandingPage(true);}} className="hover:text-indigo-300">Home</a></li>
                <li><a href="#" className="hover:text-indigo-300">About</a></li>
                <li><a href="#" className="hover:text-indigo-300">Contact</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="flex-1 py-12 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-6">
            <div className="flex-1 flex flex-col bg-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-600">
              <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-300" style={{ fontFamily: 'Cinzel, serif' }}>Forge Your Story</h2>
              <div className="flex justify-center mb-8 space-x-2 sm:space-x-4">
                {tabs.map((tab, index) => (
                  <button key={index} onClick={() => setActiveTab(index)}
                    className={`px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-medium transition-all duration-300 ease-in-out ${activeTab === index ? 'bg-indigo-600 text-white shadow-lg transform scale-105 border border-indigo-500' : 'bg-gray-600 text-gray-200 hover:bg-gray-500 hover:text-white border border-gray-600'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="min-h-[150px] bg-gray-900 rounded-lg p-6 mb-6 overflow-y-auto text-gray-100 shadow-inner border border-gray-700">
                {isLoading || isImageLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    <p className="ml-4 text-lg text-indigo-400">Crafting your tale...</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap text-base leading-relaxed">{response}</p>
                )}
              </div>
              {activeTab === 0 && renderForgeHeroContent()}
              {activeTab === 1 && renderSpinTaleContent()}
              {activeTab === 2 && renderBindBookContent()}
            </div>
            {activeTab === 2 && currentBindBookStep === 1 && (
               <div className="w-full md:w-1/3 flex-shrink-0 bg-gray-700 rounded-xl shadow-2xl p-6 sm:p-8 border border-gray-600">
                  <h3 className="text-2xl font-semibold mb-4 text-center text-indigo-300" style={{ fontFamily: 'Cinzel, serif' }}>The Grand Ledger</h3>
                  <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                      {renderLedgerContent(storyState)}
                  </div>
               </div>
            )}
          </div>
        </main>
        <footer className="bg-gray-900 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-8 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} StorySmith. All rights reserved.
          </div>
        </footer>
      </div>
    );
  
    return (
      <>
        <Head>
          <title>StorySmith - Your Imagination, Illustrated</title>
          <meta name="description" content="Create beautifully illustrated storybooks with AI." />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        </Head>
        {showLandingPage ? <LandingPage email={email} setEmail={setEmail} showLandingPage={showLandingPage} setShowLandingPage={setShowLandingPage} isVideoFinished={isVideoFinished} setIsVideoFinished={setIsVideoFinished} handleSignUpSubmit={handleSignUpSubmit} showPasswordInput={showPasswordInput} setShowPasswordInput={setShowPasswordInput} adminPasswordInput={adminPasswordInput} setAdminPasswordInput={setAdminPasswordInput} handleAdminLogin={handleAdminLogin} /> : renderAppInterface()}
      </>
    );
  }
}