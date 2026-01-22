import React from 'react';

function RecipeDetail({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div className="recipe-detail-overlay" onClick={onClose}>
      <div className="recipe-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2>{recipe.name}</h2>
        
        <div className="recipe-info">
          <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
          <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} minutes</p>
          <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
          <p><strong>Type:</strong> {recipe.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</p>
        </div>

        <div className="ingredients">
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="instructions">
          <h3>Instructions:</h3>
          <p>{recipe.instructions}</p>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="tags">
            <h3>Tags:</h3>
            {recipe.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetail;