export const LINEUP_ROSTER = Object.freeze(['bifang', 'fuzhu', 'yinglong', 'baize']);
export const LEVEL4_ROSTER = LINEUP_ROSTER;

export function normalizeLineup(types = []) {
  return [...new Set(types)].filter(type => LINEUP_ROSTER.includes(type));
}

export function isValidLineup(types = []) {
  return types.length === 3 && normalizeLineup(types).length === 3;
}
