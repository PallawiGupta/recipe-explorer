const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  prepTimeMinutes: {
    type: Number,
    required: true
  },
  ingredients: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  instructions: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);