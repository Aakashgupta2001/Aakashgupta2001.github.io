import { describe, expect, it } from 'vitest';
import { curve, edgesOf } from '../../src/lib/diagram';
import { systemMap } from '../../src/content/portfolio';

describe('curve', () => {
  it('draws a straight line for vertical links', () => {
    expect(curve({ x: 10, y: 0 }, { x: 10, y: 50 })).toBe('M10 0 L10 50');
  });
  it('draws an S-curve with control points at the midpoint', () => {
    expect(curve({ x: 0, y: 0 }, { x: 100, y: 40 })).toBe('M0 0 C 50 0, 50 40, 100 40');
  });
});

describe('systemMap', () => {
  const ids = new Set(systemMap.nodes.map((n) => n.id));
  it('only links nodes that exist', () => {
    for (const [a, b] of systemMap.edges) {
      expect(ids.has(a)).toBe(true);
      expect(ids.has(b)).toBe(true);
    }
  });
  it('connects every node to something', () => {
    for (const id of ids) expect(edgesOf(id, systemMap.edges).length).toBeGreaterThan(0);
  });
  it('keeps every node inside the drawing', () => {
    for (const n of systemMap.nodes) {
      expect(n.x).toBeGreaterThan(0);
      expect(n.x).toBeLessThan(systemMap.w);
      expect(n.y).toBeGreaterThan(0);
      expect(n.y).toBeLessThan(systemMap.h);
    }
  });
});
