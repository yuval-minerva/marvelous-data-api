// tests/integration/marvelIntegration.spec.js
import express from "express";
import request from "supertest";
import marvelRoutes from "../../routes/marvelRoutes.js";
import * as marvelService from "../../services/marvelService.js";

describe("Marvel API Integration", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/marvel", marvelRoutes);
  });

  describe("GET /marvel/moviesPerActor", () => {
    it("should return movies per actor", async () => {
      // Mock service
      const mockData = { "Chris Evans": ["Movie A"] };
      vi.spyOn(marvelService, "getMoviesPerActor").mockResolvedValue(mockData);

      const res = await request(app).get("/marvel/moviesPerActor");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(marvelService.getMoviesPerActor).toHaveBeenCalledOnce();
    });

    it("should handle errors", async () => {
      vi.spyOn(marvelService, "getMoviesPerActor").mockRejectedValue(new Error("Service error"));

      const res = await request(app).get("/marvel/moviesPerActor");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Service error" });
    });
  });

  describe("GET /marvel/actorsWithMultipleCharacters", () => {
    it("should return actors with multiple characters", async () => {
      const mockData = { "Chris Evans": [{ movie: "Movie A", character: "Steve Rogers" }] };
      vi.spyOn(marvelService, "getActorsWithMultipleCharacters").mockResolvedValue(mockData);

      const res = await request(app).get("/marvel/actorsWithMultipleCharacters");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(marvelService.getActorsWithMultipleCharacters).toHaveBeenCalledOnce();
    });

    it("should handle errors", async () => {
      vi.spyOn(marvelService, "getActorsWithMultipleCharacters").mockRejectedValue(new Error("Service error"));

      const res = await request(app).get("/marvel/actorsWithMultipleCharacters");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Service error" });
    });
  });

  describe("GET /marvel/charactersWithMultipleActors", () => {
    it("should return characters with multiple actors", async () => {
      const mockData = { "Spider-Man": ["Tom Holland", "Tobey Maguire"] };
      vi.spyOn(marvelService, "getCharactersWithMultipleActors").mockResolvedValue(mockData);

      const res = await request(app).get("/marvel/charactersWithMultipleActors");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockData);
      expect(marvelService.getCharactersWithMultipleActors).toHaveBeenCalledOnce();
    });

    it("should handle errors", async () => {
      vi.spyOn(marvelService, "getCharactersWithMultipleActors").mockRejectedValue(new Error("Service error"));

      const res = await request(app).get("/marvel/charactersWithMultipleActors");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Service error" });
    });
  });
});
