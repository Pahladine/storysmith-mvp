// context/StoryContext.js
import React, { createContext, useState, useContext } from 'react';
import useTypewriter from '../hooks/useTypewriter';
import useAdminAuth from '../hooks/useAdminAuth';

const StoryContext = createContext();

export const useStory = () => useContext(StoryContext);

export const StoryProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  
  const [storyState, setStoryState] = useState({ 
    story_content: { 
      CharacterBlock: null,
      SceneBlocks: []
    } 
  });
  
  const [sharedResponse, setSharedResponse] = useState("Loading...");

  const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '6425';
  const {
    showPasswordInput,
    setShowPasswordInput,
    adminPasswordInput,
    setAdminPasswordInput,
    handleAdminLogin,
  } = useAdminAuth(password, () => setShowLandingPage(false));

  const keeperDialogue = useTypewriter(sharedResponse, 25);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/store-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        alert("Thank you! You're on the list.");
        setEmail('');
      } else {
        alert("There was an error. Please try again.");
      }
    } catch (error) {
      console.error('Email submission error:', error);
      alert("An unexpected error occurred.");
    }
  };

  const value = {
    email,
    setEmail,
    showLandingPage,
    setShowLandingPage,
    activeTab,
    setActiveTab,
    storyState,
    setStoryState,
    sharedResponse,
    setSharedResponse,
    keeperDialogue,
    handleSignUpSubmit,
    showPasswordInput,
    setShowPasswordInput,
    adminPasswordInput,
    setAdminPasswordInput,
    handleAdminLogin,
  };

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};