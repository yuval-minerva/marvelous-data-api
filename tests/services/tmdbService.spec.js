import { describe, it, expect, beforeEach, vi } from "vitest";
import axios from "axios";
import * as tmdbService from "../../services/tmdbService.js";

// Mock axios
vi.mock("axios");

describe("tmdbService.getMovieCreditsById", () => {
  const movieId = 1;
  const creditsMock = [
    { actorName: "Chris Evans", characterName: "Steve Rogers" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset internal cache in tmdbService
    tmdbService.cache = {};
  });

  it("fetches and maps cast correctly", async () => {
    axios.get.mockResolvedValue({
      data: { cast: [{ name: "Chris Evans", character: "Steve Rogers" }] },
    });

    const result = await tmdbService.getMovieCreditsById(movieId);

    expect(result).toEqual(creditsMock);
    expect(axios.get).toHaveBeenCalledOnce();
  });

  it("uses cache if available", async () => {
    // First call populates cache
    axios.get.mockResolvedValue({
      data: { cast: [{ name: "Chris Evans", character: "Steve Rogers" }] },
    });

    await tmdbService.getMovieCreditsById(movieId);

    // Clear mock call history to detect new calls
    axios.get.mockClear();

    // Second call should hit cache
    const result = await tmdbService.getMovieCreditsById(movieId);

    expect(result).toEqual(creditsMock);
    expect(axios.get).not.toHaveBeenCalled(); // cached, so no new axios call
  });
});
