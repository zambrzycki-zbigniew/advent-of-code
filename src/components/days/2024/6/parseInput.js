export function parseInput(input) {
    const rows = input.replaceAll('\r').split('\n')
    const cells = rows.map(row => row.split(""))
    const area = {}
    let guardLocation = null
    for (let y in cells) {
        for (let x in cells[y]) {
            area[`${x}:${y}`] = cells[y][x]
            if (!guardLocation && ["^", "v", ">", "<"].includes(cells[y][x])) guardLocation = `${x}:${y}`
        }

    }
    return [{area, guardLocation}];
}
