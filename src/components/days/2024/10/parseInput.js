export function parseInput(input) {
    const cells = input.replaceAll('\r', '').split('\n').map(row => row.split(''))
    const topoMapDict = {}
    const heightDict = {}
    for (let y in cells) {
        for (let x in cells[y]) {
            topoMapDict[`${x}:${y}`] = cells[y][x]
            if (!heightDict[cells[y][x]]) heightDict[cells[y][x]] = []
            heightDict[cells[y][x]].push(`${x}:${y}`)
        }
    }
    return [{topoMapDict, heightDict}]
}
