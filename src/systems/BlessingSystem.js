import { GAME_CONFIG } from '../config/gameData.js';

const MAX_STACKS = 2;

export class BlessingSystem {
  constructor(data, random = Math.random) { this.data = data; this.random = random; this.stacks = {}; this.modifiers = {}; }
  weightFor(blessing, deployedTypes) { return blessing.weight * (blessing.tower && deployedTypes.includes(blessing.tower) ? GAME_CONFIG.deployedBlessingWeight : 1); }
  drawChoices(deployedTypes = []) {
    const pool = this.data.filter(item => (this.stacks[item.id] ?? 0) < MAX_STACKS);
    const choices = [];
    while (choices.length < 3 && pool.length) {
      const weights = pool.map(item => this.weightFor(item, deployedTypes));
      const total = weights.reduce((sum, value) => sum + value, 0);
      let roll = this.random() * total;
      let index = 0;
      while (index < pool.length - 1 && roll >= weights[index]) { roll -= weights[index]; index += 1; }
      choices.push(pool.splice(index, 1)[0]);
    }
    return choices;
  }
  select(id) {
    const blessing = this.data.find(item => item.id === id);
    if (!blessing || (this.stacks[id] ?? 0) >= MAX_STACKS) return false;
    this.stacks[id] = (this.stacks[id] ?? 0) + 1;
    this.modifiers[blessing.effect.key] = (this.modifiers[blessing.effect.key] ?? 0) + blessing.effect.add;
    return true;
  }
}
