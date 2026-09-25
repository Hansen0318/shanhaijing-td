import { ownedRosterThrough } from '../config/progressionData.js?v=level9-1';

export function normalizeLineup(types = [], eligibleRoster = ownedRosterThrough(Infinity)) {
  return [...new Set(types)].filter(type => eligibleRoster.includes(type));
}

export function isValidLineup(types = [], eligibleRoster = ownedRosterThrough(Infinity)) {
  return types.length === 3 && normalizeLineup(types, eligibleRoster).length === 3;
}
