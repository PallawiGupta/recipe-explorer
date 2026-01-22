import React, { useState } from 'react';

function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    isVegetarian: '',
    maxPrepTime: '',
    ingredient: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="filters">
        <input
          type="text"
          name="cuisine"
          placeholder="Cuisine (e.g., Indian)"
          value={filters.cuisine}
          onChange={handleFilterChange}
        />
        <select
          name="isVegetarian"
          value={filters.isVegetarian}
          onChange={handleFilterChange}
        >
          <option value="">All Types</option>
          <option value="true">Vegetarian</option>
          <option value="false">Non-Vegetarian</option>
        </select>
        <input
          type="number"
          name="maxPrepTime"
          placeholder="Max prep time (min)"
          value={filters.maxPrepTime}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="ingredient"
          placeholder="Ingredient"
          value={filters.ingredient}
          onChange={handleFilterChange}
        />
      </div>
    </div>
  );
}

export default SearchBar;