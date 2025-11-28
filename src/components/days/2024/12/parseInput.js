export function parseInput(input) {
    let debug = false
    const cells = input.replaceAll('\r', '').split('\n').map(row => row.split(''))
    const farmMap = {}
    const typeMap = {}
    const regions = {}
    for (let y in cells) {
        for (let x in cells[y]) {
            farmMap[`${x}:${y}`] = cells[y][x]
            if (!typeMap[cells[y][x]]) typeMap[cells[y][x]] = []
            typeMap[cells[y][x]].push(`${x}:${y}`)
        }
    }
    for (let [type, plots] of Object.entries(typeMap)) {
        regions[type] = []
        let unusedPlots = [...plots]
        let region = { plots: [] }
        while (unusedPlots.length > 0) {
            const plot = unusedPlots.pop()
            region.plots.push(plot)
            let neighbours = gnc(plot.split(':'), unusedPlots)
            while (neighbours.length > 0) {
                region.plots.push(...neighbours)
                unusedPlots = unusedPlots.filter(p => !region.plots.includes(p))
                neighbours = Array.from(new Set(region.plots.map(n => gnc(n.split(':'), unusedPlots)).flat()))
            }
            regions[type].push(region)
            region = { plots: [] }
        }
    }
    return [farmMap, typeMap, regions]
}

//getNeighboursCoords
function gnc([x, y], map) {
    x = parseInt(x)
    y = parseInt(y)
    let coords = [
        `${x}:${y - 1}`,
        `${x + 1}:${y}`,
        `${x}:${y + 1}`,
        `${x - 1}:${y}`
    ]
    if (Array.isArray(map)) return coords.filter(neighbour => map.includes(neighbour))
    return coords.filter(neighbour => map[neighbour])
}
