import { PriorityQueue } from "@/utils/graph";

export function solvePart1(graph, start, end) {
    return dijkstraWithPath(graph, start, end).distance;
}

export function solvePart2(graph, start, end, blockades, helperGraph) {
    //last blockade
    let lb = null
    let { path, distance } = dijkstraWithPath(graph, start, end)
    while (distance !== Infinity) {
        [lb] = blockades.splice(0, 1)
        lb = `${lb.x}:${lb.y}`
        if (helperGraph[lb]) {
            helperGraph[lb].forEach(node => {
                delete graph[node][lb]
            });
        }
        if (path.includes(lb)) {
            ({ path, distance } = dijkstraWithPath(graph, start, end))
        }
    }
    return lb.replace(':', ',');
}

function dijkstra(graph, start, end) {
    const distances = {}
    const pq = new PriorityQueue()
    for (let node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0
    pq.enqueue(start, 0)
    while (!pq.isEmpty()) {
        const { element: current } = pq.dequeue()
        if (current === end) continue
        for (let neighbor in graph[current]) {
            const weight = graph[current][neighbor]
            const newDistance = distances[current] + weight
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance
                pq.enqueue(neighbor, newDistance)
            }
        }
    }
    return Math.min(distances[end])
}

function dijkstraWithPath(graph, start, end) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue()
    for (let node in graph) {
        distances[node] = Infinity
        previous[node] = null
    }
    distances[start] = 0
    pq.enqueue(start, 0)
    while (!pq.isEmpty()) {
        const { element: current } = pq.dequeue()
        if (current === end && pq.isEmpty()) break
        for (let neighbor in graph[current]) {
            const weight = graph[current][neighbor]
            const newDistance = distances[current] + weight
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance
                previous[neighbor] = current
                pq.enqueue(neighbor, newDistance)
            }
        }
    }
    const path = []
    let currentNode = end
    while (currentNode !== null) {
        path.unshift(currentNode)
        currentNode = previous[currentNode]
    }
    return {
        distance: distances[end],
        path: path,
    }
}
