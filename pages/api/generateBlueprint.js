// pages/api/generateBlueprint.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { heroDetails } = req.body;

  if (!heroDetails || !heroDetails.name) {
    return res.status(400).json({ message: 'Hero details are required' });
  }

  // This is a placeholder response that mimics the final API structure.
  const blueprint = {
    summary_sections: {
      beginning: `Our hero, ${heroDetails.name}, is called to an adventure.`,
      middle: `They face many challenges and grow stronger.`,
      end: `After a final battle, they return home a true hero.`,
    },
    structure: {
      numberOfScenes: 3,
      scenes: [
        { title: "The Call to Adventure" },
        { title: "The Darkest Moment" },
        { title: "Triumph and Return" },
      ],
    },
  };

  res.status(200).json({ story_content: { StoryBlueprintBlock: blueprint } });
}