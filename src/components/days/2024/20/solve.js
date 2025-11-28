import { PriorityQueue } from "@/utils/graph";

export function solvePart1(pictosecondsToBeSaved, start, end, graph) { 
    const {path, distances} = dijkstraWithPath(graph, start, end)
    let viableCheats = new Set()
    for(let spot of path) {
        const [x, y] = spot.split(':').map(Number)
        const cheatable = getCheatable(x, y, distances)
        // if(pictosecondsToBeSaved < 100)
        //     console.log(cheatable, spot, distances[spot], cheatable.map(cheat => `${cheat} ${distances[cheat]} ${distances[spot] - distances[cheat]}`))
        for(let cheat of cheatable) {
            if(distances[cheat] - pictosecondsToBeSaved -1 >= distances[spot]) viableCheats.add(`${spot}-${cheat}`)
        }
    }
    return viableCheats.size
}

export function solvePart2(pictosecondsToBeSaved, start, end, graph) { 
    const {path, distances} = dijkstraWithPath(graph, start, end)
    let viableCheats = new Set()
    for(let spot of path) {
        const [x, y] = spot.split(':').map(Number)
        const reachable = getReachable(x, y, distances, 20).map(reach => reach.split('/'))
        // if(pictosecondsToBeSaved < 100)
        //     console.log(reachable.map(cheat => `${spot} ${cheat[0]} ${cheat[1]} ${distances[spot]} ${distances[cheat[0]]} ${(distances[cheat[0]] - parseInt(cheat[1])) - distances[spot]}`))
        for(let [cheat, steps] of reachable) {
            if((distances[cheat] - parseInt(steps)) - distances[spot] >= pictosecondsToBeSaved) viableCheats.add(`${spot}-${cheat}`)
        }
    }
    return viableCheats.size
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
        distances
    }
}

function getCheatable(x, y, map) {
    return [
        `${x}:${y - 2}`, //NN
        `${x + 1}:${y - 1}`, //NE
        `${x + 2}:${y}`, //EE
        `${x + 1}:${y + 1}`, //SE
        `${x}:${y + 2}`, //SS
        `${x - 1}:${y + 1}`, //SW
        `${x - 2}:${y}`, //WW
        `${x - 1}:${y - 1}`, //NW
    ].filter(n => map[n])
}

function getReachable(x, y, map, steps) {
    const visited = new Set()
    const reachable = new Set()
    dfs(x, y, steps, map, visited, reachable, steps)
    return Array.from(reachable);
}

const directions = [
    { dx: 0, dy: -1 }, //N
    { dx: 0, dy: 1 },  //S
    { dx: -1, dy: 0 }, //W
    { dx: 1, dy: 0 }   //E
]

function dfs(currX, currY, remainingSteps, map, visited, reachable, steps) {
    const coord = `${currX}:${currY}`;
    if (remainingSteps < 0 || visited.has(`${coord}/${steps-remainingSteps}`)) return
    visited.add(`${coord}/${steps-remainingSteps}`);
    if (map[coord]) reachable.add(`${coord}/${steps-remainingSteps}`)
    if (remainingSteps > 0) {
        for (const { dx, dy } of directions) {
            dfs(currX + dx, currY + dy, remainingSteps - 1, map, visited, reachable, steps);
        }
    }
}