const direction = {
    "^": { d: [0, -1], next: ">" },
    ">": { d: [1, 0], next: "v" },
    "v": { d: [0, 1], next: "<" },
    "<": { d: [-1, 0], next: "^" }
}

export function solvePart1(input) {
    let guardLocation = input.guardLocation
    const visitedSpots = {}
    let steps = 0
    const area = { ...input.area }
    visitedSpots[guardLocation] = {}
    visitedSpots[guardLocation][area[guardLocation]] = steps
    let guardCoordinates = guardLocation.split(':').map(c => parseInt(c))
    let nextDelta = direction[area[guardLocation]].d
    let nextLocation = [guardCoordinates[0] + nextDelta[0], guardCoordinates[1] + nextDelta[1]].join(':')
    if (area[nextLocation] !== undefined && area[nextLocation] === "#") {
        area[guardLocation] = direction[area[guardLocation]].next
        nextLocation = guardLocation
    }
    while (area[nextLocation]) {
        steps++
        nextDelta = direction[area[guardLocation]].d
        nextLocation = [guardCoordinates[0] + nextDelta[0], guardCoordinates[1] + nextDelta[1]].join(':')
        if (area[nextLocation] !== undefined && area[nextLocation] === "#") {
            area[guardLocation] = direction[area[guardLocation]].next
            nextLocation = guardLocation
        } else if (area[nextLocation] === ".") {
            let currentDirection = area[guardLocation]
            area[guardLocation] = "."
            area[nextLocation] = currentDirection
            guardLocation = nextLocation
            guardCoordinates = guardLocation.split(':').map(c => parseInt(c))
            if (!visitedSpots[guardLocation])
                visitedSpots[guardLocation] = {}
            visitedSpots[guardLocation][area[guardLocation]] = steps
        } else if (area[nextLocation] === undefined) {
            Object.keys(visitedSpots).forEach(spot => area[spot] = 'X')
            console.log(areaToString(area))
        }
    }
    return Object.keys(visitedSpots).length;
}

export function solvePart2(input) {
    let initialGuardPosition = input.guardLocation
    let guardLocation = initialGuardPosition
    let obstructionPositions = {}
    const visitedSpots = {}
    let path = []
    const area = { ...input.area }
    visitedSpots[guardLocation] = {}
    visitedSpots[guardLocation][area[guardLocation]] = path.length
    path.push({ pos: guardLocation, dir: area[guardLocation] })
    let guardCoordinates = guardLocation.split(':').map(c => parseInt(c))
    let nextDelta = direction[area[guardLocation]].d
    let nextLocation = [guardCoordinates[0] + nextDelta[0], guardCoordinates[1] + nextDelta[1]].join(':')
    if (area[nextLocation] !== undefined && area[nextLocation] === "#") {
        area[guardLocation] = direction[area[guardLocation]].next
        nextLocation = guardLocation
    }
    while (area[nextLocation]) {
        nextDelta = direction[area[guardLocation]].d
        nextLocation = [guardCoordinates[0] + nextDelta[0], guardCoordinates[1] + nextDelta[1]].join(':')
        if (area[nextLocation] !== undefined && area[nextLocation] === "#") {
            area[guardLocation] = direction[area[guardLocation]].next
            nextLocation = guardLocation
        } else if (area[nextLocation] === ".") {
            let currentDirection = area[guardLocation]
            area[guardLocation] = "."
            area[nextLocation] = currentDirection
            guardLocation = nextLocation
            path.push({ pos: guardLocation, dir: area[guardLocation] })
            guardCoordinates = guardLocation.split(':').map(c => parseInt(c))
            if (!visitedSpots[guardLocation])
                visitedSpots[guardLocation] = {}
            visitedSpots[guardLocation][area[guardLocation]] = path.length
        }
    }
    for (let pos in visitedSpots) {
        if (pos !== initialGuardPosition) {
            let newArea = { ...input.area }
            let leastSteps = Math.min(...Object.values(visitedSpots[pos]))
            let { pos: prevPos, dir: prevDir } = path[leastSteps - 2]
            newArea[initialGuardPosition] = '.'
            newArea[prevPos] = prevDir
            newArea[pos] = "O"
            if (testForLoop(prevPos, newArea, visitedSpots, leastSteps)) obstructionPositions[pos] = true
        }
    }
    Object.keys(obstructionPositions).forEach(spot => area[spot] = 'O')
    console.log(areaToString(area))
    return Object.keys(obstructionPositions).length;
}

function testForLoop(initialGuardPosition, area, previouslyVisitedSpots, leastStepsToObstruction) {
    let guardLocation = initialGuardPosition
    const visitedSpots = {}
    let path = []
    visitedSpots[guardLocation] = {}
    visitedSpots[guardLocation][area[guardLocation]] = path.length
    path.push({ pos: guardLocation, dir: area[guardLocation] })
    let guardCoordinates = guardLocation.split(':').map(c => parseInt(c))
    let nextDelta = direction[area[guardLocation]].d
    let nextLocation = [guardCoordinates[0] + nextDelta[0], guardCoordinates[1] + nextDelta[1]].join(':')
    if (area[nextLocation] !== undefined && (area[nextLocation] === "#" || area[nextLocation] === "O")) {
        area[guardLocation] = direction[area[guardLocation]].next
        nextLocation = guardLocation
    }
    while (area[nextLocation]) {
        if (previouslyVisitedSpots[nextLocation] &&
            previouslyVisitedSpots[nextLocation][area[nextLocation]] &&
            previouslyVisitedSpots[nextLocation][area[nextLocation]] < leastStepsToObstruction)
            return true
        nextDelta = direction[area[guardLocation]].d
        nextLocation = [guardCoordinates[0] + nextDelta[0], guardCoordinates[1] + nextDelta[1]].join(':')
        if (area[nextLocation] !== undefined && (area[nextLocation] === "#" || area[nextLocation] === "O")) {
            area[guardLocation] = direction[area[guardLocation]].next
            nextLocation = guardLocation
        } else if (area[nextLocation] === ".") {
            let currentDirection = area[guardLocation]
            area[guardLocation] = "."
            area[nextLocation] = currentDirection
            guardLocation = nextLocation
            path.push({ pos: guardLocation, dir: area[guardLocation] })
            guardCoordinates = guardLocation.split(':').map(c => parseInt(c))
            if (!visitedSpots[guardLocation])
                visitedSpots[guardLocation] = {}
            if (visitedSpots[guardLocation][area[guardLocation]]) return true
            else visitedSpots[guardLocation][area[guardLocation]] = path.length
        } else if (area[nextLocation] !== undefined) return false
    }
    return false
}

function areaToString(area) {
    const positions = Object.keys(area)
        .map(key => {
            const [x, y] = key.split(':').map(Number);
            return { x, y, char: area[key] };
        });
    const minX = Math.min(...positions.map(pos => pos.x));
    const maxX = Math.max(...positions.map(pos => pos.x));
    const minY = Math.min(...positions.map(pos => pos.y));
    const maxY = Math.max(...positions.map(pos => pos.y));
    let result = '';
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const char = positions.find(pos => pos.x === x && pos.y === y)?.char || ' ';
            result += char;
        }
        result += '\n';
    }
    return result.trim();
}