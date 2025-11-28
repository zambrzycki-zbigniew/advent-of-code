export function parseInput(input) {
    const codes = input.replaceAll('\r', '').split(`\n`).map(code => ({ parts: code.split(''), number: Number(code.slice(0, -1)) }))
    for (let startNode in numericKeypad) {
        for (let endNode in numericKeypad) {
            const shortestPaths = findShortestPaths(numericKeypad, startNode, endNode)
            numericKeypad[startNode].pathTo[endNode] = selectPathWithFewestTurns(shortestPaths).directions.join('')
        }
    }
    for (let startNode in directionalKeypad) {
        for (let endNode in directionalKeypad) {
            const shortestPaths = findShortestPaths(directionalKeypad, startNode, endNode)
            directionalKeypad[startNode].pathTo[endNode] = selectPathWithFewestTurns(shortestPaths).directions.join('')
        }
    }
    return [codes, numericKeypad, directionalKeypad];
}


function findShortestPaths(graph, startNode, endNode) {
    const queue = [{ node: startNode, path: "", directions: [] }]
    const shortestPaths = []
    let shortestLength = Infinity
    while (queue.length > 0) {
        const { node, path, directions } = queue.shift()
        if (node === endNode) {
            if (path.length < shortestLength) {
                shortestLength = path.length
                shortestPaths.length = 0
            }
            if (path.length === shortestLength) {
                shortestPaths.push({ path, directions })
            }
            continue
        }
        for (const [neighbour, direction] of Object.entries(
            graph[node].neighboursDirection
        )) {
            if (!path.includes(neighbour)) {
                queue.push({
                    node: neighbour,
                    path: path + neighbour,
                    directions: [...directions, direction],
                })
            }
        }
    }
    return shortestPaths
}

function selectPathWithFewestTurns(paths) {
    return paths.reduce((bestPath, currentPath) => {
        const currentTurns = countTurns(currentPath.directions)
        const bestTurns = countTurns(bestPath.directions)
        if (currentTurns < bestTurns) {
            return currentPath
        } else if (currentTurns > bestTurns) {
            return bestPath
        }
        const bestScore = orderingScore(bestPath.directions)
        const currentScore = orderingScore(currentPath.directions)
        for (let i = 0; i < bestScore.length; i++) {
            if (bestScore[i] < currentScore[i]) {
                return bestPath
            } else if (bestScore[i] > currentScore[i]) {
                return currentPath
            }
        }
        return bestPath
    })
}

function countTurns(directions) {
    let turns = 0;
    for (let i = 1; i < directions.length; i++) {
        if (directions[i] !== directions[i - 1]) {
            turns++
        }
    }
    return turns
}

//without scoring of the paths by the order of directions
//everything eventually got wrong the deeper in recursion we went
//I'm not exactly quite certain what's the analytical reason for
//this order being one of two that works (the other has vertical directions order swapped)
//but my belief it's because all sequences start from the right side and
//in most of the cases go to left first
//initially I've believed *any* order would suffice to make sure that we're keeping the
//finger on the same button as long as possible, but for some reason it *has* to be:
//left, vertical one, vertical two, right
function orderingScore(directions) {
    const order = ["<", "^", "v", ">"]
    return order.map(dir => {
        const index = directions.indexOf(dir)
        return index === -1 ? Infinity : index
    })
}

const numericKeypad = {
    "A": {
        neighbours: {
            "0": 1,
            "3": 1,
        },
        neighboursDirection: {
            "0": "<",
            "3": "^",
        },
        pathTo: {
        }
    },
    "0": {
        neighbours: {
            "2": 1,
            "A": 1,
        },
        neighboursDirection: {
            "2": "^",
            "A": ">",
        },
        pathTo: {
        }
    },
    "3": {
        neighbours: {
            "2": 1,
            "A": 1,
            "6": 1,
        },
        neighboursDirection: {
            "2": "<",
            "A": "v",
            "6": "^",
        },
        pathTo: {
        }
    },
    "2": {
        neighbours: {
            "1": 1,
            "0": 1,
            "5": 1,
            "3": 1,
        },
        neighboursDirection: {
            "1": "<",
            "0": "v",
            "5": "^",
            "3": ">",
        },
        pathTo: {
        }
    },
    "1": {
        neighbours: {
            "4": 1,
            "2": 1,
        },
        neighboursDirection: {
            "4": "^",
            "2": ">",
        },
        pathTo: {
        }
    },
    "6": {
        neighbours: {
            "5": 1,
            "3": 1,
            "9": 1,
        },
        neighboursDirection: {
            "5": "<",
            "3": "v",
            "9": "^",
        },
        pathTo: {
        }
    },
    "5": {
        neighbours: {
            "4": 1,
            "2": 1,
            "8": 1,
            "6": 1,
        },
        neighboursDirection: {
            "4": "<",
            "2": "v",
            "8": "^",
            "6": ">",
        },
        pathTo: {
        }
    },
    "4": {
        neighbours: {
            "1": 1,
            "7": 1,
            "5": 1
        },
        neighboursDirection: {
            "1": "v",
            "7": "^",
            "5": ">"
        },
        pathTo: {
        }
    },
    "9": {
        neighbours: {
            "8": 1,
            "6": 1,
        },
        neighboursDirection: {
            "8": "<",
            "6": "v",
        },
        pathTo: {
        }
    },
    "8": {
        neighbours: {
            "7": 1,
            "5": 1,
            "9": 1
        },
        neighboursDirection: {
            "7": "<",
            "5": "v",
            "9": ">"
        },
        pathTo: {
        }
    },
    "7": {
        neighbours: {
            "4": 1,
            "8": 1,
        },
        neighboursDirection: {
            "4": "v",
            "8": ">",
        },
        pathTo: {
        }
    },
}

const directionalKeypad = {
    "A": {
        neighbours: {
            "^": 1,
            ">": 1,
        },
        neighboursDirection: {
            "^": "<",
            ">": "v",
        },
        pathTo: {
        }
    },
    "^": {
        neighbours: {
            "v": 1,
            "A": 1,
        },
        neighboursDirection: {
            "v": "v",
            "A": ">",
        },
        pathTo: {
        }
    },
    ">": {
        neighbours: {
            "v": 1,
            "A": 1,
        },
        neighboursDirection: {
            "v": "<",
            "A": "^",
        },
        pathTo: {
        }
    },
    "v": {
        neighbours: {
            "<": 1,
            "^": 1,
            ">": 1,
        },
        neighboursDirection: {
            "<": "<",
            "^": "^",
            ">": ">",
        },
        pathTo: {
        }
    },
    "<": {
        neighbours: {
            "v": 1,
        },
        neighboursDirection: {
            "v": ">",
        },
        pathTo: {
        }
    },
}