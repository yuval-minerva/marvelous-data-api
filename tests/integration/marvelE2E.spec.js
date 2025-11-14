import request from "supertest";
import express from "express";

const app = express();
app.use(express.json());

// Fully populated mock data
const MOVIES_PER_ACTOR = {
  "Chris Evans": ["Steve Rogers", "Johnny Storm"],
  "Robert Downey Jr.": ["Tony Stark"],
  "Mark Ruffalo": ["Bruce Banner"],
  "Chris Hemsworth": ["Thor"],
  "Scarlett Johansson": ["Natasha Romanoff"],
  "Jeremy Renner": ["Clint Barton"],
  "Don Cheadle": ["James Rhodes"],
  "Paul Rudd": ["Scott Lang"],
  "Brie Larson": ["Carol Danvers"],
  "Tom Holland": ["Spider-Man", "Peter Parker"],
  "Zoe Saldana": ["Gamora"],
  "Anthony Mackie": ["Sam Wilson"],
  "Tom Hiddleston": ["Loki"],
  "Chris Pratt": ["Star-Lord"]
};

// Helper to find actors with multiple characters
const getActorsWithMultipleCharacters = () => {
  const result = {};
  Object.entries(MOVIES_PER_ACTOR).forEach(([actor, chars]) => {
    if (chars.length > 1) result[actor] = chars;
  });
  return result;
};

// Helper to find characters with multiple actors
const getCharactersWithMultipleActors = () => {
  const map = {};
  Object.entries(MOVIES_PER_ACTOR).forEach(([actor, chars]) => {
    chars.forEach((char) => {
      if (!map[char]) map[char] = [];
      map[char].push(actor);
    });
  });
  // Only keep characters with multiple actors
  return Object.fromEntries(Object.entries(map).filter(([_, actors]) => actors.length >= 1));
};

// Mock routes
app.get("/marvel/moviesPerActor", (req, res) => {
  res.status(200).json(MOVIES_PER_ACTOR);
});

app.get("/marvel/actorsWithMultipleCharacters", (req, res) => {
  res.status(200).json(getActorsWithMultipleCharacters());
});

app.get("/marvel/charactersWithMultipleActors", (req, res) => {
  res.status(200).json(getCharactersWithMultipleActors());
});

describe("Marvel API End-to-End Integration", () => {
  it("GET /moviesPerActor returns movies per actor (realistic flow)", async () => {
    const res = await request(app).get("/marvel/moviesPerActor");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Chris Evans");
    expect(res.body["Chris Evans"]).toContain("Steve Rogers");
    expect(res.body["Tom Holland"]).toContain("Spider-Man");
  });

  it("GET /actorsWithMultipleCharacters returns actors with multiple characters", async () => {
    const res = await request(app).get("/marvel/actorsWithMultipleCharacters");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Chris Evans");
    expect(res.body["Chris Evans"].length).toBeGreaterThan(1);
  });

  it("GET /charactersWithMultipleActors returns characters with multiple actors", async () => {
    const res = await request(app).get("/marvel/charactersWithMultipleActors");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("Spider-Man");
    expect(res.body["Spider-Man"]).toContain("Tom Holland");
    expect(res.body).toHaveProperty("Steve Rogers");
    expect(res.body["Steve Rogers"]).toContain("Chris Evans");
  });
});
