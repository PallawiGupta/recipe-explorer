# Recipe Explorer - MERN Stack Application

A full-stack web application for managing and exploring recipes with AI-powered features.

## What This Does

This is a recipe management system where you can search for recipes, filter them by different criteria, and use AI to get cooking suggestions or simplify recipe instructions. I built this to learn the MERN stack and practice integrating external APIs.

## Tech Stack

- **Frontend**: React, Axios, CSS3
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: Hugging Face API (free tier)

## Features

- Search recipes by name
- Filter by cuisine, vegetarian/non-veg, prep time, and ingredients
- View detailed recipe information
- AI-powered recipe simplification
- Get recipe suggestions based on available ingredients

## Setup Instructions

### What You Need

- Node.js (version 14 or higher)
- MongoDB (local or Atlas)
- Hugging Face account (free)

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
npm install
```

1. Create a `.env` file in the backend folder:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/recipe-explorer
HUGGINGFACE_API_KEY=your_api_key_here

1. Get your Hugging Face API key:
   - Sign up at <https://huggingface.co>
   - Go to Settings > Access Tokens
   - Create a new token with "read" access
   - Copy it to your .env file

2. Start the backend:

```bash
npm run dev
```

The server will run on <http://localhost:5000>

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
npm install
```

1. Start the frontend:

```bash
npm start
```

The app will open at <http://localhost:3000>

### Database Setup

If using local MongoDB:

```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud) - just update the MONGODB_URI in your .env file.

## Adding Sample Data

You can add recipes through Postman or any API testing tool.

**Endpoint**: POST <http://localhost:5000/api/recipes>

**Example Request Body**:

```json
{
  "name": "Paneer Butter Masala",
  "cuisine": "Indian",
  "isVegetarian": true,
  "prepTimeMinutes": 40,
  "ingredients": ["paneer", "tomato", "cream", "butter", "spices"],
  "difficulty": "medium",
  "instructions": "Step 1: Cut paneer into cubes and fry. Step 2: Make tomato gravy. Step 3: Add paneer and simmer.",
  "tags": ["dinner", "rich", "party"]
}
```

## API Endpoints

### Recipes

- `GET /api/recipes` - Get all recipes (supports filters)
- `GET /api/recipes/:id` - Get one recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

### AI Features

- `POST /api/ai/simplify` - Simplify recipe instructions
- `POST /api/ai/suggest` - Get recipe suggestions

### Query Parameters for Search

- `search` - Search by recipe name
- `cuisine` - Filter by cuisine type
- `isVegetarian` - true/false
- `maxPrepTime` - Maximum prep time in minutes
- `ingredient` - Filter by ingredient

Example: `http://localhost:5000/api/recipes?cuisine=Indian&isVegetarian=true`
<!-- 
## Project Structure

recipe-explorer/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   └── Recipe.js             # Recipe schema
│   ├── routes/
│   │   ├── recipes.js            # Recipe CRUD operations
│   │   └── ai.js                 # AI features
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeList.js
│   │   │   ├── RecipeDetail.js
│   │   │   ├── SearchBar.js
│   │   │   └── AIAssistant.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md -->

## How I Built This

I started by setting up the backend with Express and MongoDB, then created the API endpoints for recipe CRUD operations. The search and filter functionality uses MongoDB queries. For the frontend, I used React with functional components and hooks to manage state. The AI integration was the trickiest part - I used Hugging Face's free API with retry logic and fallback responses in case the models are loading.

## Known Issues

- The free Hugging Face API can take 20-30 seconds to "warm up" if the models haven't been used recently
- AI features use smart fallbacks when the API is unavailable
- No user authentication (recipes are shared by all users)

## What I Learned

- Building RESTful APIs with Express
- MongoDB queries and filtering
- React state management with hooks
- Handling async operations and API calls
- Error handling and fallback strategies
- Working with external APIs

## Future Improvements

- Add user authentication
- Allow image uploads for recipes
- Implement recipe ratings
- Add meal planning feature
- Mobile app version

## License

This project was created for learning purposes.

## Contact

If you have questions about this project, feel free to reach out.
