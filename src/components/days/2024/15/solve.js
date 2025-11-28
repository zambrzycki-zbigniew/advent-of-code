export function solvePart1(map, moves, robot) {
    let sum = 0
    for (let move of moves) {
        robot = moveTo(robot, move, map)
    }
    for (let [coord,] of Object.entries(map).filter(([, v]) => v === 'O')) {
        sum += (([x, y]) => 100 * y + x)(coord.split(':').map(c => parseInt(c)))
    }
    return sum;
}

export function solvePart2(_, moves, __, robot, map) {
    let sum = 0
    for (let move of moves) {
        robot = moveToWide(robot, move, map)
    }
    for (let [coord,] of Object.entries(map).filter(([, v]) => v === '[')) {
        sum += (([x, y]) => 100 * y + x)(coord.split(':').map(c => parseInt(c)))
    }
    return sum;
}

function moveTo(from, direction, map) {
    const to = directions[direction](from)
    if (map[to] === '#') return from
    if (map[to] === '.') {
        let a = map[from]
        let b = map[to]
        map[from] = b
        map[to] = a
        return to
    }
    if (map[to] === 'O') {
        let pushedTo = moveTo(to, direction, map)
        if (pushedTo === to) return from
        let a = map[from]
        let b = map[to]
        map[from] = b
        map[to] = a
        return to
    }
}


function moveToWide(from, direction, map) {
    const to = directions[direction](from)
    if (map[to] === '#') return from
    if (map[to] === '.') {
        let a = map[from]
        let b = map[to]
        map[from] = b
        map[to] = a
        return to
    }
    if (map[to] === '[' || map[to] === ']') {
        let other
        let [x2, y2] = to.split(':').map(Number)
        if (map[to] === '[') other = `${x2 + 1}:${y2}`
        else other = `${x2 - 1}:${y2}`
        if (!(canMove(to, direction, map) && canMove(other, direction, map))) return from
        push(to, direction, map)
        if (direction !== '>' && direction !== '<') push(other, direction, map)
        let a = map[from]
        let b = map[to]
        map[from] = b
        map[to] = a
        return to
    }
}

function canMove(from, direction, map) {
    const checked = new Set()
    const stack = [from]
    while (stack.length > 0) {
        const current = stack.pop()
        checked.add(current)
        const to = directions[direction](current)
        if (map[to] === '#') return false
        if (map[to] === '.') continue
        if (map[to] === '[' || map[to] === ']') {
            let other
            let [x2, y2] = to.split(':').map(Number)
            if (map[to] === '[') other = `${x2 + 1}:${y2}`
            else other = `${x2 - 1}:${y2}`
            if (!checked.has(to)) stack.push(to)
            if (!checked.has(other)) stack.push(other)
        }
    }
    return true
}


function push(from, direction, map) {
    const to = directions[direction](from)
    if (map[to] === '.') {
        let a = map[from]
        let b = map[to]
        map[from] = b
        map[to] = a
    }
    else if (map[to] === '[' || map[to] === ']') {
        let other
        let [x2, y2] = to.split(':').map(Number)
        if (map[to] === '[') other = `${x2 + 1}:${y2}`
        else other = `${x2 - 1}:${y2}`
        push(to, direction, map)
        if (direction !== '>' && direction !== '<') push(other, direction, map)
        let a = map[from]
        let b = map[to]
        map[from] = b
        map[to] = a
    }

}

const directions = {
    '^': (coord) => (([x, y]) => `${x}:${y - 1}`)(coord.split(':').map(c => parseInt(c))),
    '>': (coord) => (([x, y]) => `${x + 1}:${y}`)(coord.split(':').map(c => parseInt(c))),
    'v': (coord) => (([x, y]) => `${x}:${y + 1}`)(coord.split(':').map(c => parseInt(c))),
    '<': (coord) => (([x, y]) => `${x - 1}:${y}`)(coord.split(':').map(c => parseInt(c)))
}

function mapToString(map) {
    const positions = Object.keys(map).map(key => {
        const [x, y] = key.split(':').map(Number)
        return { x, y, value: map[key] }
    })
    const maxX = Math.max(...positions.map(pos => pos.x))
    const maxY = Math.max(...positions.map(pos => pos.y))
    const grid = Array.from({ length: maxY + 1 }, () =>
        Array.from({ length: maxX + 1 }, () => " ")
    )
    positions.forEach(({ x, y, value }) => {
        grid[y][x] = value
    })
    return grid.map(row => row.join("")).join("\n")
}