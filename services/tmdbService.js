import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";

const cache = new Map(); // movieId -> cast[]

export async function getMovieCreditsById(movieId) {
  if (cache.has(movieId)) return cache.get(movieId);

  const res = await axios.get(`${TMDB_BASE}/movie/${movieId}/credits`, {
    params: { api_key: TMDB_KEY }
  });

  const cast = res.data.cast.map(c => ({
    actorName: c.name,
    characterName: c.character
  }));

  cache.set(movieId, cast);
  return cast;
}
