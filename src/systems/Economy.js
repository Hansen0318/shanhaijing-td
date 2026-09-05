export class Economy {
  constructor(gold) { this.gold = gold; }
  canAfford(cost) { return this.gold >= cost; }
  spend(cost) { if (!this.canAfford(cost)) return false; this.gold -= cost; return true; }
  reward(amount, multiplier = 1) { this.gold += Math.round(amount * multiplier); }
  add(amount) { this.gold += amount; }
  static upgradeCost(towerData, currentLevel) { return Math.round(towerData.cost * (currentLevel === 1 ? 0.8 : 1.2)); }
  static sellValue(invested) { return Math.floor(invested * 0.6); }
}
