export function parseInput(input) {
    const grid = input.replaceAll(`\r`, ``).split(`\n`).map(row => row.split(''))
    let start, end
    for (let y in grid) {
        for (let x in grid[y]) {
            if (grid[y][x] === 'E') {
                grid[y][x] = '.'
                end = `${x},${y}`
            }
            else if (grid[y][x] === 'S') {
                grid[y][x] = '.'
                start = `${x},${y},E`
            }
        }
    }
    const graph = buildGraph(grid)
    return [graph, start, end, grid];
}

function buildGraph(grid) {
    const graph = {}
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '#') continue
            for (let dir in turnDirections) {
                const key = `${x},${y},${dir}`
                graph[key] = {}
                const [dx, dy] = getDirectionDelta(dir)
                const nx = x + dx
                const ny = y + dy
                if (x === 1 && y === 13 && dir === 'E') console.log(key, dx, dy, nx, ny, isValid(nx, ny, grid), grid[ny][nx], `${nx},${ny},${dir}`)
                if (isValid(nx, ny, grid)) {
                    graph[key][`${nx},${ny},${dir}`] = 1
                }
                for (let newDir of turnDirections[dir]) {
                    graph[key][`${x},${y},${newDir}`] = 1000

                }
            }
        }
    }

    return graph;
}

function getDirectionDelta(direction) {
    switch (direction) {
        case 'N': return [0, -1];
        case 'E': return [1, 0];
        case 'S': return [0, 1];
        case 'W': return [-1, 0];
        default: return [0, 0];
    }
}

function isValid(x, y, grid) {
    return grid[y] && grid[y][x] === '.';
}

const turnDirections = {
    N: ['W', 'E'],
    E: ['N', 'S'],
    S: ['E', 'W'],
    W: ['S', 'N']
};