export function solvePart1({ topoMapDict, heightDict }) {
    let sum = 0
    const trailheads = heightDict['0']
    for (let trailhead of trailheads) {
        sum += findPeaksForTrailheadIterative(trailhead, topoMapDict)
    }
    return sum;
}

export function solvePart2({ topoMapDict, heightDict }) {
    let sum = 0
    const trailheads = heightDict['0']
    for (let trailhead of trailheads) {
        sum += getCountOfValidTrailsFromTrailheadIterative(trailhead, topoMapDict)
    }
    return sum;
}

function getHigherNeighbours(topoMapDict, x, y) {
    return [
        `${x}:${y - 1}`,
        `${x + 1}:${y}`,
        `${x}:${y + 1}`,
        `${x - 1}:${y}`,
    ].filter(neighbour => parseInt(topoMapDict[neighbour]) === (parseInt(topoMapDict[`${x}:${y}`]) + 1))
}

function findPeaksForTrailhead(trailhead, topoMapDict, peaksFoundSoFar) {
    const [x, y] = trailhead.split(':').map(el => parseInt(el))
    let currentSpot = trailhead
    let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
    if (higherNeighbours.length > 0) return higherNeighbours.map(n => findPeaksForTrailhead(n, topoMapDict, peaksFoundSoFar)).reduce((sum, count) => sum + count, 0)
    if (topoMapDict[currentSpot] === '9' && !peaksFoundSoFar[currentSpot]) {
        peaksFoundSoFar[currentSpot] = true
        return 1
    }
    return 0
}

function getCountOfValidTrailsFromTrailhead(trailhead, topoMapDict) {
    const [x, y] = trailhead.split(':').map(el => parseInt(el))
    let currentSpot = trailhead
    let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
    if (higherNeighbours.length > 0) return higherNeighbours.map(n => getCountOfValidTrailsFromTrailhead(n, topoMapDict)).reduce((sum, count) => sum + count, 0)
    if (topoMapDict[currentSpot] === '9')
        return 1
    return 0
}

function findPeaksForTrailheadIterative(trailhead, topoMapDict) {
    let stack = [trailhead]
    const peaksFoundSoFar = new Set()
    while (stack.length > 0) {
        const current = stack.pop()
        const [x, y] = current.split(':').map(el => parseInt(el))
        let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
        if (higherNeighbours.length > 0) stack.push(...higherNeighbours)
        else if (topoMapDict[current] === '9') peaksFoundSoFar.add(current)
    }
    return peaksFoundSoFar.size
}

function getCountOfValidTrailsFromTrailheadIterative(trailhead, topoMapDict) {
    let stack = [trailhead]
    let validTrails = 0
    while (stack.length > 0) {
        const current = stack.pop()
        const [x, y] = current.split(':').map(el => parseInt(el))
        let higherNeighbours = getHigherNeighbours(topoMapDict, x, y)
        if (higherNeighbours.length > 0) stack.push(...higherNeighbours)
        if (topoMapDict[current] === '9') validTrails++
    }
    return validTrails
}