export function parseInput(input) {    
    const cells = input.replaceAll('\r').split('\n').map(row => row.split(''))
    const antennas = {}
    const antennasMap = {}
    for(let y in cells) {
        for(let x in cells[y]) {
            if(cells[y][x] !== '.') {
                if(!antennas[cells[y][x]]) antennas[cells[y][x]] = []
                antennas[cells[y][x]].push(`${x}:${y}`)
            }
            antennasMap[`${x}:${y}`] = cells[y][x]
        }
    }
    return [{antennas, antennasMap}];
}
