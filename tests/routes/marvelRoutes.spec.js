// tests/routes/marvelRoutes.spec.js
import request from "supertest";
import express from "express";
import marvelRouter from "../../routes/marvelRoutes.js";
import * as marvelService from "../../services/marvelService.js";

vi.mock("../../services/marvelService");

const app = express();
app.use(express.json());
app.use("/", marvelRouter);

describe("Marvel Routes", () => {

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /moviesPerActor", () => {
    it("returns movies per actor successfully", async () => {
      marvelService.getMoviesPerActor.mockResolvedValue({
        "Chris Evans": ["Movie A", "Movie B"],
      });

      const res = await request(app).get("/moviesPerActor");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("Chris Evans");
      expect(res.body["Chris Evans"]).toEqual(["Movie A", "Movie B"]);
      expect(marvelService.getMoviesPerActor).toHaveBeenCalledOnce();
    });

    it("returns 500 if service throws an error", async () => {
      marvelService.getMoviesPerActor.mockRejectedValue(new Error("Service failed"));

      const res = await request(app).get("/moviesPerActor");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Service failed" });
    });
  });

  describe("GET /actorsWithMultipleCharacters", () => {
    it("returns actors with multiple characters successfully", async () => {
      marvelService.getActorsWithMultipleCharacters.mockResolvedValue({
        "Chris Evans": ["Steve Rogers", "Human Torch"],
      });

      const res = await request(app).get("/actorsWithMultipleCharacters");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("Chris Evans");
      expect(res.body["Chris Evans"]).toEqual(["Steve Rogers", "Human Torch"]);
      expect(marvelService.getActorsWithMultipleCharacters).toHaveBeenCalledOnce();
    });

    it("returns 500 if service throws an error", async () => {
      marvelService.getActorsWithMultipleCharacters.mockRejectedValue(new Error("Service failed"));

      const res = await request(app).get("/actorsWithMultipleCharacters");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Service failed" });
    });
  });

  describe("GET /charactersWithMultipleActors", () => {
    it("returns characters with multiple actors successfully", async () => {
      marvelService.getCharactersWithMultipleActors.mockResolvedValue({
        "Spider-Man": ["Tom Holland", "Tobey Maguire"],
      });

      const res = await request(app).get("/charactersWithMultipleActors");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("Spider-Man");
      expect(res.body["Spider-Man"]).toEqual(["Tom Holland", "Tobey Maguire"]);
      expect(marvelService.getCharactersWithMultipleActors).toHaveBeenCalledOnce();
    });

    it("returns 500 if service throws an error", async () => {
      marvelService.getCharactersWithMultipleActors.mockRejectedValue(new Error("Service failed"));

      const res = await request(app).get("/charactersWithMultipleActors");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: "Service failed" });
    });
  });
});
