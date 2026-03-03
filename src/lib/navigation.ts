import { NavNode, NavEdge, PathResult, WALKING_SPEED } from './types';

interface AdjacencyList {
  [nodeId: string]: { to: string; distance: number }[];
}

export function buildGraph(edges: NavEdge[]): AdjacencyList {
  const graph: AdjacencyList = {};
  for (const edge of edges) {
    if (!graph[edge.from]) graph[edge.from] = [];
    if (!graph[edge.to]) graph[edge.to] = [];
    graph[edge.from].push({ to: edge.to, distance: edge.distance });
    graph[edge.to].push({ to: edge.from, distance: edge.distance });
  }
  return graph;
}

export function dijkstra(
  graph: AdjacencyList,
  start: string,
  end: string
): PathResult | null {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const queue: { node: string; distance: number }[] = [];

  // Initialize
  for (const node of Object.keys(graph)) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[start] = 0;
  queue.push({ node: start, distance: 0 });

  while (queue.length > 0) {
    // Sort and get minimum
    queue.sort((a, b) => a.distance - b.distance);
    const current = queue.shift()!;

    if (visited.has(current.node)) continue;
    visited.add(current.node);

    if (current.node === end) break;

    const neighbors = graph[current.node] || [];
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.to)) continue;
      const newDist = distances[current.node] + neighbor.distance;
      if (newDist < distances[neighbor.to]) {
        distances[neighbor.to] = newDist;
        previous[neighbor.to] = current.node;
        queue.push({ node: neighbor.to, distance: newDist });
      }
    }
  }

  if (distances[end] === Infinity) return null;

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }

  const distance = distances[end];
  const walkingTime = Math.ceil(distance / WALKING_SPEED);

  return { path, distance, walkingTime };
}
