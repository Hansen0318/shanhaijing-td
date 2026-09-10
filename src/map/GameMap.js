export class GameMap {
  constructor(data) {
    this.data = data;
    this.segments = [];
    this.totalLength = 0;
    for (let index = 1; index < data.waypoints.length; index += 1) {
      const from = data.waypoints[index - 1];
      const to = data.waypoints[index];
      const length = Math.hypot(to.x - from.x, to.y - from.y);
      this.segments.push({ from, to, length, start: this.totalLength });
      this.totalLength += length;
    }
  }
  positionAt(distance) {
    const clamped = Math.max(0, Math.min(distance, this.totalLength));
    const segment = this.segments.find(item => clamped <= item.start + item.length) ?? this.segments.at(-1);
    const t = segment.length ? (clamped - segment.start) / segment.length : 0;
    return { x: segment.from.x + (segment.to.x - segment.from.x) * t, y: segment.from.y + (segment.to.y - segment.from.y) * t };
  }
  isWeakWater(point) {
    return (this.data.weakWaterZones ?? []).some(zone => (
      point.x >= zone.x && point.x <= zone.x + zone.width
      && point.y >= zone.y && point.y <= zone.y + zone.height
    ));
  }
  slotAt(point, radius = 30) { return this.data.slots.findIndex(slot => Math.hypot(slot.x - point.x, slot.y - point.y) <= radius); }
}
