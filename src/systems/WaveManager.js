export class WaveManager {
  constructor(waves) { this.waves = waves; this.reset(); }
  reset() { this.waveNumber = 0; this.queue = []; this.spawnTimer = 0; this.spawnedAlive = 0; this.active = false; }
  start(number) {
    if (this.active) return false;
    const wave = this.waves[number - 1];
    if (!wave) return false;
    this.waveNumber = number;
    this.interval = wave.interval;
    this.queue = wave.groups.flatMap(group => Array.from({ length: group.count }, () => group.type));
    this.spawnTimer = 0;
    this.spawnedAlive = 0;
    this.active = true;
    return true;
  }
  update(dt, spawn) {
    if (!this.active || !this.queue.length) return;
    this.spawnTimer -= dt;
    while (this.queue.length && this.spawnTimer <= 0) {
      spawn(this.queue.shift());
      this.spawnedAlive += 1;
      this.spawnTimer += this.interval;
    }
  }
  enemyRemoved() { this.spawnedAlive = Math.max(0, this.spawnedAlive - 1); }
  isComplete() { return this.active && this.queue.length === 0 && this.spawnedAlive === 0; }
  finish() { this.active = false; }
}
