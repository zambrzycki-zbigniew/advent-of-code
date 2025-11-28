export function solvePart1(...input) {
    const [,,regions] = input
    let sum = 0
    for (let region of Object.values(regions).flat()) {
        let regionPerimeter = 0
        region.plots.forEach(plot => {
            //gnc = getNeighboursCoords
            regionPerimeter += 4 - gnc(plot.split(':'), region.plots).length
        })
        sum += regionPerimeter * region.plots.length
    }
    return sum;
}

export function solvePart2(...input) {
    const [,,regions] = input
    let sum = 0
    for (let [,typeRegions] of Object.entries(regions)) {
        for (let region of typeRegions) {
            //cine = checkIfNeighbourExists
            let tops = mergeSides(region.plots.filter(plot => !cine(plot.split(':'), 'top', region.plots)), 'top')
            let rights = mergeSides(region.plots.filter(plot => !cine(plot.split(':'), 'right', region.plots)), 'right')
            let bottoms = mergeSides(region.plots.filter(plot => !cine(plot.split(':'), 'bottom', region.plots)), 'bottom')
            let lefts = mergeSides(region.plots.filter(plot => !cine(plot.split(':'), 'left', region.plots)), 'left')
            let sides = [tops, rights, bottoms, lefts].flat()
            sum += sides.length * region.plots.length
        }
    }
    return sum;
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

const directions = {
    top: (x, y) => `${parseInt(x)}:${parseInt(y) - 1}`,
    right: (x, y) => `${parseInt(x) + 1}:${parseInt(y)}`,
    bottom: (x, y) => `${parseInt(x)}:${parseInt(y) + 1}`,
    left: (x, y) => `${parseInt(x) - 1}:${parseInt(y)}`,
}

//checkIfNeighbourExists
function cine([x, y], direction, map) {
    if (Array.isArray(map)) return map.includes(directions[direction](x, y))
    return map[directions[direction](x, y)]
}

const sidesToCheck = {
    top: ['left', 'right'],
    bottom: ['left', 'right'],
    left: ['top', 'bottom'],
    right: ['top', 'bottom'],
}

function checkIfAdjacent(p1, p2, direction) {
    let neighbours = sidesToCheck[direction].map(s => directions[s](...p1.split(':')))
    return neighbours.includes(p2)
}

function mergeSides(plots, direction) {
    let sides = []
    plots.forEach(plot => {
        let side = []
        for (let s of sides) if (s.some(p => checkIfAdjacent(plot, p, direction))) side = s
        side.push(plot)
        if (!sides.includes(side)) sides.push(side)
    })
    return sides
}