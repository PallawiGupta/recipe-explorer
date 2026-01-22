import React from 'react';

function RecipeList({ recipes, onSelectRecipe }) {
  return (
    <div className="recipe-list">
      {recipes.length === 0 ? (
        <p>No recipes found. Try adjusting your search!</p>
      ) : (
        recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="recipe-card"
            onClick={() => onSelectRecipe(recipe)}
          >
            <h3>{recipe.name}</h3>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} minutes</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            {recipe.isVegetarian && <span className="badge">Vegetarian</span>}
          </div>
        ))
      )}
    </div>
  );
}

export default RecipeList;