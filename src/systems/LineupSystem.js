export const LEVEL4_ROSTER = Object.freeze(['bifang', 'fuzhu', 'yinglong', 'baize']);

export function normalizeLineup(types = []) {
  return [...new Set(types)].filter(type => LEVEL4_ROSTER.includes(type));
}

export function isValidLineup(types = []) {
  return types.length === 3 && normalizeLineup(types).length === 3;
}
