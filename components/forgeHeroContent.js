// components/forgeHeroContent.js

export const conversation = {
  name: {
    question: "And what name shall the heralds sing for this hero of ours?",
    choices: [
      { text: "1. I have a name in mind!", action: 'user_provides' },
      { text: "2. I'd like you to suggest a few fitting names!", action: 'ai_suggests' },
      { text: "3. Let's make up a whimsical fantasy name together!", action: 'ai_whimsical' },
      { text: "4. Surprise me, StorySmith!", action: 'ai_surprise' }
    ]
  },
  name_suggestions: {
    question: "Of course! Here are a few names that sound heroic. Do any of these sing to you?",
    choices: [
      { text: "Rowan", field: 'name', value: 'Rowan', next: 'age' },
      { text: "Elara", field: 'name', value: 'Elara', next: 'age' },
      { text: "Finn", field: 'name', value: 'Finn', next: 'age' },
      { text: "None of these, let me see other options.", action: 'name' }
    ]
  },
  age: {
    question: "How many years has our hero adventured?",
    choices: [
        { text: "A. 4 years old", field: 'age', value: '4', next: 'gender' },
        { text: "B. 5 years old", field: 'age', value: '5', next: 'gender' },
        { text: "C. 6 years old", field: 'age', value: '6', next: 'gender' },
        { text: "D. 7 years old", field: 'age', value: '7', next: 'gender' },
        { text: "E. 8 years old", field: 'age', value: '8', next: 'gender' },
        { text: "F. 9 years old", field: 'age', value: '9', next: 'gender' },
        { text: "I have a different age in mind!", action: 'age_provide', gridCols: 2 },
        { text: "Surprise me, StorySmith! 🎲", field: 'age', value: 'AI Surprise', next: 'gender', gridCols: 2 },
    ]
  },
  gender: {
    question: "And how shall we refer to our hero?",
    choices: [
        { text: "1. A brave boy!", field: 'gender', value: 'boy', next: 'traits' },
        { text: "2. A clever girl!", field: 'gender', value: 'girl', next: 'traits' },
        { text: "3. A wondrous child!", field: 'gender', value: 'non-binary', next: 'traits' },
        { text: "4. Surprise me, StorySmith! ✨", field: 'gender', value: 'AI Surprise', next: 'traits' },
    ]
  },
};