export function parseInput(input) {
    let pictosecondsToBeSaved = 100
    input = input.replaceAll('r', '')
    const splitted = input.split('\n\n')
    if (splitted.length > 1)
        [pictosecondsToBeSaved, input] = splitted
    const rows = input.split('\n').map(row => row.split(''))
    let start, end
    const graph = {}
    const map = {}
    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            if (rows[y][x] === 'S') {
                start = `${x}:${y}`
                rows[y][x] = '.'
            }
            else if (rows[y][x] === 'E') {
                end = `${x}:${y}`
                rows[y][x] = '.'
            }
            map[`${x}:${y}`] = rows[y][x]
        }
    }
    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            if (rows[y][x] === '.') {
                graph[`${x}:${y}`] = {}
                const neighbours = getNeighbours(x, y, map)
                for (let neighbour of neighbours)
                    graph[`${x}:${y}`][neighbour] = 1
            }
        }
    }
    console.log(pictosecondsToBeSaved)
    return [parseInt(pictosecondsToBeSaved), start, end, graph]
}

function getNeighbours(x, y, map) {
    return [
        `${x}:${y - 1}`, //N
        `${x + 1}:${y}`, //E
        `${x}:${y + 1}`, //S
        `${x - 1}:${y}`, //W
    ].filter(n => map[n] && map[n] !== '#')
}