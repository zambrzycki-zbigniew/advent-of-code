export function solvePart1(graph, start, end) {
    return dijkstraWithOrientation(graph, start, end);
}

export function solvePart2(graph, start, end, grid) {
    const visitedNodes = dijkstraWithPaths(graph, start, end);
    // console.log('Visited nodes:', visitedNodes);
    // console.log(markVisitedNodes(grid, visitedNodes))
    return new Set(visitedNodes).size;
}

function dijkstraWithOrientation(graph, start, end) {
    const distances = {}
    const pq = new PriorityQueue()
    for (let node in graph) {
        distances[node] = Infinity;
    }
    distances[start] = 0
    pq.enqueue(start, 0)
    while (!pq.isEmpty()) {
        const { element: current } = pq.dequeue()
        if (current.startsWith(`${end},`)) continue
        for (let neighbor in graph[current]) {
            const weight = graph[current][neighbor]
            const newDistance = distances[current] + weight
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance
                pq.enqueue(neighbor, newDistance)
            }
        }
    }
    console.log(distances)
    return Math.min(...Object.keys(distances)
        .filter(node => node.startsWith(`${end},`))
        .map(node => distances[node]));
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }
    enqueue(element, priority) {
        this.items.push({ element, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
}

function dijkstraWithPaths(graph, start, end) {
    const distances = {}
    const pq = new PriorityQueue()
    const paths = {}
    for (let node in graph) {
        distances[node] = Infinity
        paths[node] = []
    }
    distances[start] = 0
    paths[start] = [[start]]
    pq.enqueue(start, 0)
    let minDistance = Infinity
    let minPaths = []
    while (!pq.isEmpty()) {
        const { element: current } = pq.dequeue()
        if (current.startsWith(`${end},`)) {
            const distance = distances[current]
            if (distance < minDistance) {
                minDistance = distance
                minPaths = paths[current]
            } else if (distance === minDistance) {
                minPaths.push(...paths[current])
            }
            continue
        }
        for (let neighbor in graph[current]) {
            const weight = graph[current][neighbor]
            const newDistance = distances[current] + weight
            if (newDistance < distances[neighbor]) {
                distances[neighbor] = newDistance
                paths[neighbor] = paths[current].map(path => [...path, neighbor])
                pq.enqueue(neighbor, newDistance)
            } else if (newDistance === distances[neighbor]) {
                paths[neighbor].push(...paths[current].map(path => [...path, neighbor]))
            }
        }
    }
    const visitedNodes = new Set()
    minPaths.forEach(path => {
        path.forEach(node => {
            const [x, y] = node.split(',').slice(0, 2)
            visitedNodes.add(`${x},${y}`)
        })
    })
    return [...visitedNodes]
}

function markVisitedNodes(grid, visitedNodes) {
    const newGrid = grid.map(row => [...row])
    visitedNodes.forEach(node => {
        const [x, y] = node.split(',').map(Number)
        if (newGrid[y] && newGrid[y][x] === '.') {
            newGrid[y][x] = 'O'
        }
    })
    return newGrid.map(row => row.join('')).join('\n');
}
