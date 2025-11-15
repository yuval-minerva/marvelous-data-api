# Vi Coding Assignment

## How to run: TLDR

```bash
echo "TMDB_API_KEY=..." > .env
npm install
npm start
```

Browse to: http://localhost:3000 for a list of API endpoints.

## Project Structure (without tests)

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
    ├── tmdbService.js          # Access TMDB api and caching
    ├── dedupCharacterNames.js  # Deduplicated similar character names
    └── marvelService.js        # Business logic
```

## Unit tests

Run using `npm run test` OR `npm run test:ui` which will open a browser window http://localhost:51204/__vitest__/ with full dashboard and coverage report.

