/** A smooth horizontal S-curve between two points, as an SVG path. Vertical links stay straight. */
export function curve(a: { x: number; y: number }, b: { x: number; y: number }): string {
  if (a.x === b.x) return `M${a.x} ${a.y} L${b.x} ${b.y}`;
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

/** Edges touching a node, used to light up its connections on hover. */
export function edgesOf(id: string, edges: [string, string][]): [string, string][] {
  return edges.filter(([a, b]) => a === id || b === id);
}
