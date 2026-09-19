import { LEVELS } from './gameData.js';

export const BASE_OWNED_ROSTER = Object.freeze(['bifang', 'fuzhu', 'yinglong']);
export const UNLOCK_BY_LEVEL = Object.freeze({ 3: 'baize', 6: 'jumang' });
export const BEAST_NAMES = Object.freeze({
  bifang: '畢方', fuzhu: '夫諸', yinglong: '應龍', baize: '白澤', jumang: '句芒',
});
export const PLAYABLE_LEVEL_IDS = Object.freeze(
  Object.keys(LEVELS).map(Number).sort((a, b) => a - b),
);

export function baseOwnedRoster() {
  return [...BASE_OWNED_ROSTER];
}

export function ownedRosterThrough(levelId) {
  const unlocked = Object.entries(UNLOCK_BY_LEVEL)
    .filter(([clearedLevelId]) => Number(clearedLevelId) <= levelId)
    .sort(([left], [right]) => Number(left) - Number(right))
    .map(([, beast]) => beast);
  return [...BASE_OWNED_ROSTER, ...unlocked];
}

export function nextPlayableLevelId(levelId) {
  return PLAYABLE_LEVEL_IDS.find(id => id > levelId) ?? null;
}
