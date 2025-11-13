import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Marvel API</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          a { display: block; margin: 10px 0; font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>Marvel API</h1>
        <a href="/moviesPerActor">Movies per actor</a>
        <a href="/actorsWithMultipleCharacters">Actors with multiple characters</a>
        <a href="/charactersWithMultipleActors">Characters with multiple actors</a>
      </body>
    </html>
  `);
});

export default router;
