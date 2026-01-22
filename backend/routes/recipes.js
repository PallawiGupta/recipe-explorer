const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Get all recipes with search and filters
router.get('/', async (req, res) => {
  try {
    const { 
      cuisine, 
      isVegetarian, 
      maxPrepTime, 
      tags, 
      ingredient,
      search 
    } = req.query;

    let query = {};

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $regex: cuisine, $options: 'i' };
    }

    // Filter by vegetarian
    if (isVegetarian) {
      query.isVegetarian = isVegetarian === 'true';
    }

    // Filter by prep time
    if (maxPrepTime) {
      query.prepTimeMinutes = { $lte: parseInt(maxPrepTime) };
    }

    // Filter by tags
    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    // Filter by ingredient
    if (ingredient) {
      query.ingredients = { $regex: ingredient, $options: 'i' };
    }

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new recipe
router.post('/', async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete recipe
router.delete('/:id', async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;