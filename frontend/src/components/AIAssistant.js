import React, { useState } from 'react';
import axios from 'axios';

function AIAssistant({ selectedRecipe }) {
  const [ingredients, setIngredients] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimplify = async () => {
    if (!selectedRecipe) {
      alert('Please select a recipe first!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/simplify', {
        instructions: selectedRecipe.instructions
      });
      setAiResponse(response.data.simplified);
    } catch (error) {
      setAiResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleSuggest = async () => {
    if (!ingredients.trim()) {
      alert('Please enter some ingredients!');
      return;
    }

    setLoading(true);
    try {
      const ingredientList = ingredients.split(',').map(i => i.trim());
      const response = await axios.post('/api/ai/suggest', {
        ingredients: ingredientList
      });
      setAiResponse(response.data.suggestion);
    } catch (error) {
      setAiResponse('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="ai-assistant">
      <h2>AI Assistant</h2>
      
      <div className="ai-section">
        <h3>Simplify Recipe Instructions</h3>
        <button onClick={handleSimplify} disabled={loading || !selectedRecipe}>
          {loading ? 'Processing...' : 'Simplify Selected Recipe'}
        </button>
      </div>

      <div className="ai-section">
        <h3>Get Recipe Suggestions</h3>
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={handleSuggest} disabled={loading}>
          {loading ? 'Processing...' : 'Get Suggestions'}
        </button>
      </div>

      {aiResponse && (
        <div className="ai-response">
          <h3>AI Response:</h3>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default AIAssistant;