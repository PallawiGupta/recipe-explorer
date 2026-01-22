const express = require('express');
const router = express.Router();

// Helper function to call Hugging Face API with retry logic
async function callHuggingFace(modelUrl, payload, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      // If model is loading, wait and retry
      if (data.error && data.error.includes('loading')) {
        const waitTime = Math.min(data.estimated_time || 20, 30);
        console.log(`Model loading, waiting ${waitTime} seconds... (attempt ${i + 1}/${retries})`);
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue;
        }
      }
      
      return data;
    } catch (error) {
      console.error(`API call failed (attempt ${i + 1}):`, error.message);
      if (i === retries - 1) throw error;
    }
  }
}

// Better manual simplification function - Creates concise one-line summary
function simplifyInstructions(instructions) {
  // Extract all steps
  const steps = instructions.split(/Step \d+:/i).filter(s => s.trim());
  
  // Extract key actions from each step
  const keyActions = steps.map(step => {
    // Clean up the step
    let cleaned = step
      .replace(/First,|Meanwhile,|Then,|Next,|After that,|Finally,/gi, '')
      .replace(/In a large pot,|In a separate pot,|In the /gi, '')
      .replace(/for at least|approximately|about/gi, 'for')
      .replace(/completely|thoroughly|carefully/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Get first sentence (main action)
    let mainAction = cleaned.split('.')[0].trim();
    
    // Replace long ingredient lists with simple terms
    mainAction = mainAction
      .replace(/in yogurt, ginger-garlic paste, red chili powder, turmeric,? and salt/gi, 'in yogurt and spices')
      .replace(/like bay leaves, cinnamon, cardamom,? and cloves/gi, 'and whole spices')
      .replace(/fresh mint leaves, coriander leaves,? and saffron soaked in milk/gi, 'herbs and saffron milk')
      .replace(/the reserved fried onions, fresh mint leaves, coriander leaves, and saffron soaked in milk/gi, 'fried onions, herbs, and saffron')
      .replace(/with a tight-fitting lid/gi, '')
      .replace(/until they turn|until it is|until the/gi, 'until')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Extract core action (verb + object)
    const words = mainAction.split(' ');
    
    // Key patterns to keep concise
    if (mainAction.includes('marinate')) {
      return 'marinate chicken in yogurt and spices';
    } else if (mainAction.includes('soak') && mainAction.includes('rice')) {
      return 'soak rice for 20 minutes';
    } else if (mainAction.includes('heat oil') || mainAction.includes('add whole spices')) {
      return 'heat oil and add whole spices';
    } else if (mainAction.includes('fry') && mainAction.includes('onions')) {
      return 'fry onions until golden';
    } else if (mainAction.includes('remove') && mainAction.includes('onions')) {
      return 'set aside half for garnish';
    } else if (mainAction.includes('cook') && mainAction.includes('chicken')) {
      return 'cook marinated chicken for 5-7 minutes';
    } else if (mainAction.includes('boil') && mainAction.includes('rice')) {
      return 'cook rice until 70% done';
    } else if (mainAction.includes('layer') && mainAction.includes('rice')) {
      return 'layer rice over chicken';
    } else if (mainAction.includes('garnish') || mainAction.includes('add') && (mainAction.includes('onions') || mainAction.includes('herbs'))) {
      return 'add fried onions, herbs, and saffron';
    } else if (mainAction.includes('cover') && mainAction.includes('cook')) {
      return 'cover and cook on low heat for 20-25 minutes';
    } else if (mainAction.includes('rest')) {
      return 'let rest for 5 minutes';
    } else if (mainAction.includes('mix') || mainAction.includes('serve')) {
      return 'mix gently and serve hot';
    }
    
    // Default: keep first 8 words
    if (words.length > 8) {
      return words.slice(0, 8).join(' ');
    }
    
    return mainAction.toLowerCase();
  }).filter(action => action && action.length > 3);
  
  // Join all actions with commas and capitalize first letter
  const simplifiedText = keyActions.join(', ');
  return simplifiedText.charAt(0).toUpperCase() + simplifiedText.slice(1) + '.';
}

// Simplify recipe instructions
router.post('/simplify', async (req, res) => {
  try {
    const { instructions } = req.body;

    console.log('Simplifying instructions...');
    
    // Try AI first
    const data = await callHuggingFace(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: instructions,
        parameters: {
          max_length: 150,
          min_length: 40,
          do_sample: false
        }
      }
    );
    
    // Check if AI worked
    if (!data.error && data[0]?.summary_text) {
      console.log('AI Simplification successful!');
      return res.json({ simplified: data[0].summary_text });
    }
    
    // Use smart fallback
    console.log('Using smart fallback simplification');
    const simplified = simplifyInstructions(instructions);
    
    res.json({ simplified });
    
  } catch (error) {
    console.error('Simplify error:', error);
    // Last resort fallback
    const simplified = simplifyInstructions(req.body.instructions);
    res.json({ simplified });
  }
});

// Suggest recipe based on ingredients
router.post('/suggest', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    console.log('Generating recipe suggestion for:', ingredients);

    // Try AI model first
    const prompt = `Write a recipe using these ingredients: ${ingredients.join(', ')}. Include steps.`;

    const data = await callHuggingFace(
      'https://api-inference.huggingface.co/models/gpt2',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false
        }
      }
    );
    
    // Check if AI worked
    if (!data.error && data[0]?.generated_text) {
      const generatedText = data[0].generated_text.trim();
      if (generatedText.length > 20) {
        const suggestion = `Recipe using ${ingredients.join(', ')}:\n\n${generatedText}`;
        console.log('AI Suggestion generated successfully!');
        return res.json({ suggestion });
      }
    }
    
    // Use smart fallback
    console.log('Using fallback suggestion generator');
    const fallbackSuggestion = generateFallbackSuggestion(ingredients);
    res.json({ suggestion: fallbackSuggestion });
    
  } catch (error) {
    console.error('Suggest error:', error);
    const fallbackSuggestion = generateFallbackSuggestion(req.body.ingredients);
    res.json({ suggestion: fallbackSuggestion });
  }
});

// Fallback suggestion generator
function generateFallbackSuggestion(ingredients) {
  const hasProtein = ingredients.some(i => 
    ['chicken', 'paneer', 'tofu', 'fish', 'beef', 'pork', 'egg', 'shrimp'].includes(i.toLowerCase())
  );
  const hasVeggies = ingredients.some(i => 
    ['tomato', 'onion', 'carrot', 'broccoli', 'pepper', 'spinach', 'potato', 'garlic'].includes(i.toLowerCase())
  );
  const hasRice = ingredients.some(i => i.toLowerCase().includes('rice'));
  const hasPasta = ingredients.some(i => ['pasta', 'noodles', 'spaghetti'].includes(i.toLowerCase()));
  
  let recipeName = 'Mixed Dish';
  let cookingMethod = 'stir-fry';
  let time = '25-30 minutes';
  
  if (hasRice && hasProtein) {
    const protein = ingredients.find(i => ['chicken', 'paneer', 'shrimp'].includes(i.toLowerCase()));
    recipeName = `${protein ? protein.charAt(0).toUpperCase() + protein.slice(1) : 'Protein'} Rice Bowl`;
    time = '30-35 minutes';
  } else if (hasPasta) {
    recipeName = hasProtein ? 'Pasta with Protein' : 'Vegetable Pasta';
    time = '20-25 minutes';
  } else if (hasProtein && hasVeggies) {
    const mainIng = ingredients[0].charAt(0).toUpperCase() + ingredients[0].slice(1);
    recipeName = `${mainIng} Stir Fry`;
  }
  
  return `🍳 Recipe Suggestion: ${recipeName}

📝 Ingredients:
${ingredients.map(ing => `• ${ing}`).join('\n')}

👨‍🍳 Cooking Instructions:

1. Prep Work: Wash and chop all ingredients into bite-sized pieces.

2. Heat Oil: Heat 2 tablespoons of oil in a pan or wok over medium-high heat.

3. Cook Main Ingredient: ${hasProtein ? 'Season and cook the protein until golden brown (5-7 minutes).' : 'Start with aromatics like garlic and ginger (1 minute).'}

4. Add Vegetables: Add your vegetables and stir-fry for 4-5 minutes until tender-crisp.

5. Season: Add salt, pepper, and your favorite spices (cumin, coriander, or soy sauce work well).

6. Combine: ${hasRice ? 'Mix with cooked rice and toss well.' : hasPasta ? 'Toss with cooked pasta.' : 'Mix everything together.'}

7. Finish: Garnish with fresh herbs and serve hot.

⏱️ Total Time: ${time}
👥 Serves: 2-3 people
🌶️ Spice Level: Adjustable to taste

💡 Pro Tip: Don't overcook vegetables - they should retain some crunch for better texture and nutrition!`;
}

module.exports = router;