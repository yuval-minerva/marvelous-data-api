import express from "express";
import {
  getMoviesPerActor,
  getActorsWithMultipleCharacters,
  getCharactersWithMultipleActors
} from "../services/marvelService.js";

const router = express.Router();

router.get("/moviesPerActor", async (req, res) => {
  try {
    const data = await getMoviesPerActor();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/actorsWithMultipleCharacters", async (req, res) => {
  try {
    const data = await getActorsWithMultipleCharacters();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/charactersWithMultipleActors", async (req, res) => {
  try {
    const data = await getCharactersWithMultipleActors();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
