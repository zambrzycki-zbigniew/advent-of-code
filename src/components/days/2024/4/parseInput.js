export function parseInput(input) {
    const rows = input.split('\n').map(splitPart => splitPart.replaceAll('\r', '')).map(row => row.split(""))
    const dictionary = {}
    for(let y in rows) {
        for(let x in rows[y])
            dictionary[`${x}:${y}`] = rows[y][x]
    }
    return [dictionary]
}