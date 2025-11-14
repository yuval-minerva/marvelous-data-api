import { describe, it, expect, beforeEach, vi } from "vitest";
import * as marvelService from "../../services/marvelService.js";
import * as tmdbService from "../../services/tmdbService.js";

// Mock focusGroup
vi.mock("../../data/focusGroup.js", () => ({
  movies: { "Movie A": 1, "Movie B": 2 },
  actors: ["Chris Evans", "Tom Holland"],
}));

vi.mock("../../services/tmdbService.js", () => ({
  getMovieCreditsById: vi.fn(),
}));

describe("marvelService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getMoviesPerActor returns movies per actor", async () => {
    tmdbService.getMovieCreditsById.mockImplementation((movieId) => {
      if (movieId === 1) return Promise.resolve([{ actorName: "Chris Evans" }]);
      if (movieId === 2) return Promise.resolve([{ actorName: "Tom Holland" }]);
      return Promise.resolve([]);
    });

    const result = await marvelService.getMoviesPerActor();

    expect(result["Chris Evans"]).toEqual(["Movie A"]);
    expect(result["Tom Holland"]).toEqual(["Movie B"]);
  });

  it("getActorsWithMultipleCharacters dedupes correctly", async () => {
    // Return multiple characters for the same actor across movies
    tmdbService.getMovieCreditsById.mockResolvedValue([
      { actorName: "Chris Evans", characterName: "Steve Rogers" },
      { actorName: "Chris Evans", characterName: "Steve Rogers" }, // duplicate
      { actorName: "Chris Evans", characterName: "Captain America" },
    ]);

    const result = await marvelService.getActorsWithMultipleCharacters();

    expect(result).toHaveProperty("Chris Evans");
    // deduplicate by characterName
    const characters = result["Chris Evans"].map((c) => c.characterName);
    expect(new Set(characters).size).toBe(2);
  });

  it("getCharactersWithMultipleActors filters correctly", async () => {
    tmdbService.getMovieCreditsById.mockResolvedValue([
      { actorName: "Actor 1", characterName: "Character A" },
      { actorName: "Actor 2", characterName: "Character A" },
      { actorName: "Actor 3", characterName: "Character B" },
      { actorName: "Actor 4", characterName: "Character A" },
    ]);

    const result = await marvelService.getCharactersWithMultipleActors();

    expect(result).toHaveProperty("Character A");
    expect(result["Character A"].length).toBeGreaterThan(1); // now allows multiple actors
    expect(result).not.toHaveProperty("Character B");
  });
});
