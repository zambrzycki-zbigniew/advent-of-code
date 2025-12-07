export function parseInput(input) {
    const rows = input.split('\n').map(row => row.split(''))
    const start = { x: rows[0].indexOf("S"), y: 0 }
    const height = rows.length
    //using Set for quick checks, could also use {}
    const splitters = new Set()
    for (let y in rows) for (let x in rows[y]) if (rows[y][x] === '^') splitters.add(`${x}.${y}`)
    return [start, splitters, height, rows];
}
