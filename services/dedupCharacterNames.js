export async function dedupActorsCharacters(actorMap, strict) {
    
  // Filter actors with more than one *distinct* character (after normalization)
  const result = {};
  for (const actor of Object.keys(actorMap)) {
    const uniqueCharacters = deduplicateCharacterNames(actorMap[actor], strict);
    if (uniqueCharacters.length > 1) {
      result[actor] = uniqueCharacters;
    }
  }

  return result;
}

  // === Character name normalization and fuzzy grouping ===

  function normalizeCharacterName(name) {
    return name
      .toLowerCase()
      .replace(/\(.*?\)/g, '') // remove (uncredited), (voice), etc.
      .replace(/['"]/g, '') // remove quotes
      .replace(/\s+/g, ' ') // normalize spaces
      .replace(/\s*\/\s*/g, ' / ') // normalize slashes
      .trim();
  }

  function extractAliases(name) {
    const norm = normalizeCharacterName(name);
    return norm.split('/').map(s => s.trim());
  }

  function areCharactersSimilar(a, b, strict) {
    if (strict) {
        return a == b;
    }
    const aliasesA = new Set(extractAliases(a));
    const aliasesB = new Set(extractAliases(b));

    for (const aliasA of aliasesA) {
      for (const aliasB of aliasesB) {
        if (aliasA === aliasB) return true;
        if (aliasA.includes(aliasB) || aliasB.includes(aliasA)) return true;
      }
    }

    return false;
  }

  function deduplicateCharacterNames(characters, strict) {
    const unique = [];
    for (const c of characters) {
      const existing = unique.find(u => areCharactersSimilar(u.characterName, c.characterName, strict));
      if (!existing) {
        unique.push(c);
      }
    }
    return unique;
  }