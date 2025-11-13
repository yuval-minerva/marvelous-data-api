import { getMovieCreditsById } from "./tmdbService.js";
import { dedupActorsCharacters } from "./dedupCharacterNames.js"
import { movies, actors } from "../data/focusGroup.js";

// Which Marvel movies did each actor play in?
export async function getMoviesPerActor() {
  const result = {};
  for (const actor of actors) result[actor] = [];

  for (const [movieName, movieId] of Object.entries(movies)) {
    const cast = await getMovieCreditsById(movieId);
    for (const { actorName } of cast) {
      if (result[actorName]) result[actorName].push(movieName);
    }
  }

  return result;
}

// Actors who played multiple Marvel characters
export async function getActorsWithMultipleCharacters() {
  const result = {};

  for (const [movieName, movieId] of Object.entries(movies)) {
    const cast = await getMovieCreditsById(movieId);
    for (const { actorName, characterName } of cast) {
      if (!result[actorName]) result[actorName] = [];
      result[actorName].push({ movieName, characterName });
    }
  }

  return dedupActorsCharacters(result, false);
}

// Roles (characters) played by more than one actor
export async function getCharactersWithMultipleActors() {
  const characterMap = {};

  for (const [movieName, movieId] of Object.entries(movies)) {
    const cast = await getMovieCreditsById(movieId);
    for (const { actorName, characterName } of cast) {
      if (!characterName) continue;
      if (!characterMap[characterName]) characterMap[characterName] = [];
      characterMap[characterName].push({ movieName, actorName });
    }
  }

  const filtered = {};
  for (const [character, entries] of Object.entries(characterMap)) {
    const uniqueActors = new Set(entries.map(e => e.actorName));
    if (uniqueActors.size > 1) filtered[character] = entries;
  }

  return filtered;
}

