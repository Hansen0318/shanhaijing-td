function clampBetween(value, a, b) {
  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), value));
}

function smoothWaypoints(points, subdivisions = 1, clampSamples = true) {
  if (subdivisions <= 1 || points.length < 3) return points;
  const result = [points[0]];

  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];

    for (let step = 1; step <= subdivisions; step += 1) {
      const t = step / subdivisions;
      const t2 = t * t;
      const t3 = t2 * t;
      const sample = axis => 0.5 * (
        2 * p1[axis]
        + (-p0[axis] + p2[axis]) * t
        + (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2
        + (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3
      );
      const x = sample('x');
      const y = sample('y');
      result.push({
        x: clampSamples ? clampBetween(x, p1.x, p2.x) : x,
        y: clampSamples ? clampBetween(y, p1.y, p2.y) : y,
      });
    }
  }

  return result;
}

function pointInPolygon(point, vertices) {
  let inside = false;
  for (let index = 0, previous = vertices.length - 1; index < vertices.length; previous = index, index += 1) {
    const currentPoint = vertices[index];
    const previousPoint = vertices[previous];
    const crosses = (currentPoint.y > point.y) !== (previousPoint.y > point.y)
      && point.x < ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) / (previousPoint.y - currentPoint.y) + currentPoint.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

export class GameMap {
  constructor(data) {
    this.data = data;
    this.waypoints = smoothWaypoints(data.waypoints, data.pathSmoothing ?? 1, data.clampPathSmoothing !== false);
    this.segments = [];
    this.totalLength = 0;
    for (let index = 1; index < this.waypoints.length; index += 1) {
      const from = this.waypoints[index - 1];
      const to = this.waypoints[index];
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
  positionBeyondEnd(extraDistance = 0) {
    const segment = this.segments.at(-1);
    if (!segment || segment.length <= 0) return this.positionAt(this.totalLength);
    const dx = (segment.to.x - segment.from.x) / segment.length;
    const dy = (segment.to.y - segment.from.y) / segment.length;
    return { x: segment.to.x + dx * Math.max(0, extraDistance), y: segment.to.y + dy * Math.max(0, extraDistance) };
  }
  isWeakWater(point) {
    return (this.data.weakWaterZones ?? []).some(zone => (
      point.x >= zone.x && point.x <= zone.x + zone.width
      && point.y >= zone.y && point.y <= zone.y + zone.height
    ));
  }
  fogZoneAt(point) {
    return (this.data.fogZones ?? []).find(zone => (
      point.x >= zone.x && point.x <= zone.x + zone.width
      && point.y >= zone.y && point.y <= zone.y + zone.height
    ))?.id ?? null;
  }
  sunlightZoneAt(point) {
    return (this.data.sunlightZones ?? []).find(zone => (
      point.x >= zone.x && point.x <= zone.x + zone.width
      && point.y >= zone.y && point.y <= zone.y + zone.height
    ))?.id ?? null;
  }
  thunderZoneAt(point) {
    return (this.data.thunderZones ?? []).find(zone => (
      point.x >= zone.x && point.x <= zone.x + zone.width
      && point.y >= zone.y && point.y <= zone.y + zone.height
    ))?.id ?? null;
  }
  wetlandZoneAt(point) {
    return (this.data.wetlandZones ?? []).find(zone => pointInPolygon(point, zone.points))?.id ?? null;
  }
  chargeCorridorAt(point) {
    const zone = this.data.chargeCorridor;
    return Boolean(zone
      && point.x >= zone.x && point.x <= zone.x + zone.width
      && point.y >= zone.y && point.y <= zone.y + zone.height);
  }
  slotAt(point, radius = 30) { return this.data.slots.findIndex(slot => Math.hypot(slot.x - point.x, slot.y - point.y) <= radius); }
}
