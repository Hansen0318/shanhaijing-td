let nextIllusionId = 1;

export class Illusion {
  constructor(source, offset, duration) {
    this.id = `illusion-${nextIllusionId++}`;
    this.sourceId = source.id;
    this.source = source;
    this.offset = { ...offset };
    this.type = source.type;
    this.data = source.data;
    this.map = source.map;
    this.x = source.x + offset.x;
    this.y = source.y + offset.y;
    this.pathDistance = source.pathDistance;
    this.life = duration;
    this.duration = duration;
    this.alive = true;
    this.isIllusion = true;
    this.countsTowardWave = false;
    this.statuses = {};
    this.radius = source.radius;
  }
  takeDamage() { this.alive = false; return true; }
  update(dt) {
    if (!this.source.alive) { this.alive = false; return; }
    this.x = this.source.x + this.offset.x;
    this.y = this.source.y + this.offset.y;
    this.pathDistance = this.source.pathDistance;
    this.life -= dt;
    if (this.life <= 0) this.alive = false;
  }
}
