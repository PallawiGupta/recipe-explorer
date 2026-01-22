import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import AIAssistant from './components/AIAssistant';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (searchTerm = '', filterParams = {}) => {
    try {
      const params = new URLSearchParams({
        ...filterParams,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await axios.get(`/api/recipes?${params}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = (searchTerm) => {
    fetchRecipes(searchTerm, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    fetchRecipes('', newFilters);
  };

  return (
    <div className="App">
      <header>
        <h1>Smart Recipe Explorer</h1>
      </header>

      <main>
        <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
        
        <div className="content">
          <div className="recipes-section">
            <RecipeList 
              recipes={recipes} 
              onSelectRecipe={setSelectedRecipe} 
            />
          </div>
          
          <div className="ai-section">
            <AIAssistant selectedRecipe={selectedRecipe} />
          </div>
        </div>
      </main>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}

export default App;