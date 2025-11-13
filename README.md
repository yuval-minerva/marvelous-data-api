# Vi Coding Assignment

## How to run: TLDR

```bash
echo "TMDB_API_KEY=..." > .env
npm install
npm start
```

## Project Structure

```
marvel-api/
│
├── package.json
├── .env                        # Configuration - api key
├── index.js                    # Main application
│
├── data/
│   └── focusGroup.js           # Movies and actors data
│
├── routes/
│   ├── index.js                # List API routes / endpoint
│   └── marvelRoutes.js         # Actual API routes / endpoint
│
└── services/
    ├── tmdbService.js          # Access TMDB api
    ├── dedupCharacterNames.js  # Handle similar character name logic
    └── marvelService.js        # Business logic
```
