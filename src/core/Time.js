export class GameTime {
  constructor() { this.scale = 1; this.paused = false; }
  setScale(scale) { if (scale === 1 || scale === 2) this.scale = scale; }
  setPaused(paused) { this.paused = Boolean(paused); }
  step(realDelta) { return this.paused ? 0 : Math.min(realDelta, 0.1) * this.scale; }
}
