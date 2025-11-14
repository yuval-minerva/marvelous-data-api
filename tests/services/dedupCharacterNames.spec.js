import { dedupActorsCharacters } from "../../services/dedupCharacterNames";

describe("dedupActorsCharacters (black-box tests)", () => {
  test("fuzzy mode groups aliases, parentheses, quotes, and substrings", async () => {
    const actorMap = {
      "Chris Evans": [
        { movieName: "Avengers", characterName: "Steve Rogers / Captain America" },
        { movieName: "Winter Soldier", characterName: "Captain America" },
        { movieName: "Random Movie", characterName: "  Steve Rogers   " },
        { movieName: "Cameo", characterName: "Captain America (uncredited)" },
        { movieName: "Special", characterName: "\"The Hulk\"" } // tests substring + quote removal
      ]
    };

    const result = await dedupActorsCharacters(actorMap, false);

    // One actor returned
    expect(Object.keys(result)).toContain("Chris Evans");

    const roles = result["Chris Evans"];

    // Should dedupe 4 variations of Captain America into 1
    expect(roles.filter(r => r.characterName.toLowerCase().includes("captain")).length)
      .toBe(1);

    // Should dedupe 2 variations of Steve Rogers + Captain grouping
    expect(roles.filter(r => r.characterName.toLowerCase().includes("steve")).length)
      .toBe(1); // because grouped into Captain America entry

    // Hulk stays separate because he didn’t play Hulk
    expect(roles.filter(r => r.characterName.toLowerCase().includes("hulk")).length)
      .toBe(1);

    // Final fuzzy dedup result: Captain America + Hulk
    expect(roles.length).toBe(2);
  });

  test("strict mode does NOT group aliases or similar names", async () => {
    const actorMap = {
      "Chris Evans": [
        { movieName: "Avengers", characterName: "Steve Rogers / Captain America" },
        { movieName: "Winter Soldier", characterName: "Captain America" },
        { movieName: "Cameo", characterName: "Captain America (uncredited)" },
        { movieName: "Some Movie", characterName: "The Hulk" }
      ]
    };

    const result = await dedupActorsCharacters(actorMap, true);

    // Strict: no characters are merged unless exactly equal
    // Inputs have 3 Captain America variants → all separate
    const roles = result["Chris Evans"];

    expect(roles.length).toBe(4); // no deduplication performed

    // Ensure they are not grouped
    expect(roles.some(r => r.characterName.includes("(uncredited)"))).toBe(true);
    expect(roles.some(r => r.characterName === "Captain America")).toBe(true);
  });

  test("actor with only one unique role is filtered out", async () => {
    const actorMap = {
      "Hugh Jackman": [
        { movieName: "X-Men", characterName: "Logan / Wolverine" },
        { movieName: "X2", characterName: "Wolverine" }
      ]
    };

    const result = await dedupActorsCharacters(actorMap, false);

    // Only one unique character → NOT included in result
    expect(result["Hugh Jackman"]).toBeUndefined();
  });

  test("multiple actors processed independently", async () => {
    const actorMap = {
      "Chris Evans": [
        { movieName: "Avengers", characterName: "Captain America" },
        { movieName: "Other", characterName: "The Hulk" }
      ],
      "Hugh Jackman": [
        { movieName: "X-Men", characterName: "Wolverine" }
      ]
    };

    const result = await dedupActorsCharacters(actorMap, false);

    // Only Chris Evans qualifies (2+ characters)
    expect(Object.keys(result)).toEqual(["Chris Evans"]);
    expect(result["Chris Evans"].length).toBe(2);
  });
});
