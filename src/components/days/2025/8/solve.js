export function solvePart1(...coordsRaw) {
    const example = coordsRaw.length === 20
    const ops = example ? 10 : 1000
    let i = 0
    //both solutions are similar so I put it in function
    const {distances, circuits, coordToCircuit} = prepareData(coordsRaw)
    while (i < ops) {
        //we take element from the end of sorted list to avoid shifting indices
        const { key } = distances.pop()
        const [coord1, coord2] = key.split(':')
        //formCircuit connects two coords if they weren't already connected
        //merges two circuits together basicially
        formCircuit(circuits, coordToCircuit, coord1, coord2)
        i++
    }
    circuits.sort((a, b) => b.size - a.size)
    return circuits[0].size * circuits[1].size * circuits[2].size
}

export function solvePart2(...coordsRaw) {
    // const example = coordsRaw.length === 20
    const {distances, circuits, coordToCircuit} = prepareData(coordsRaw)
    let coord1, coord2
    //repeat until circuits are all united
    while (circuits.length !== 1) {
        //we need that semicolon or else it'd think that [coord1, coord2] are in the same line as the pop() because javascript is funny like that
        const { key } = distances.pop();
        //we save the last pair of coords each time
        [coord1, coord2] = key.split(':')
        formCircuit(circuits, coordToCircuit, coord1, coord2)
    }
    const x1 = Number(coord1.slice(0, coord1.indexOf(',')))
    const x2 = Number(coord2.slice(0, coord2.indexOf(',')))
    return x1 * x2;
}

function prepareData(coordsRaw) {
    const coords = coordsRaw.map(row => row.split(',').map(Number)).map(([x, y, z]) => ({ x, y, z }))
    //we need distances and want them sorted
    const distances = calculateDistances(coords)
    const circuits = []
    //use map for quick lookup
    const coordToCircuit = new Map()
    for (const coord of coordsRaw) {
        //each coord starts initially as 1 element circuit
        const circuit = new Set([coord])
        circuits.push(circuit)
        //we map coords to circuits so we always know where each coord belongs with O(1) lookup time
        coordToCircuit.set(coord, circuit)
    }
    return { distances, circuits, coordToCircuit }
}


function calculateDistances(coords) {
    const distances = []
    //we only need each pair once, so j = i + 1
    for (let i = 0; i < coords.length; i++) {
        const { x, y, z } = coords[i]
        for (let j = i + 1; j < coords.length; j++) {
            const { x: xo, y: yo, z: zo } = coords[j]
            const dx = x - xo
            const dy = y - yo
            const dz = z - zo
            //to get distance we'd need to do Math.sqrt(dx^2 + dy^2 + dz^2), but sqrt is costly
            //we only need distances to compare them, and comparison of squares will always yield the same result
            //as comparision of square roots, so we can be cheap and just compare squared distances instead
            const distanceSquared = dx * dx + dy * dy + dz * dz
            //each coord:coord and distance is stored once
            const key = `${x},${y},${z}:${xo},${yo},${zo}`
            distances.push({ key, distance: distanceSquared })
        }
    }
    //sorted from greatest to smallest because it's cheaper to pop an element from the end of array instead of shifting it from the start of it
    //shifting causes reassignment of indices to all other elements while pop does nothing to them
    distances.sort((a, b) => b.distance - a.distance)
    return distances
}

function formCircuit(circuits, coordToCircuit, coord1, coord2) {
    //map grants us quick lookup O(1)
    const circuit1 = coordToCircuit.get(coord1)
    const circuit2 = coordToCircuit.get(coord2)
    //if both coords belong to the same circuit, we do nothing
    if (circuit1 === circuit2) return
    //if we want to keep using map for quick lookup, we can't do circuit1.union(circuit2)
    //but Set.union is O(n+m) anyway, so it'd at most look fancier but not help us be speedy
    for (const coord of circuit2) {
        circuit1.add(coord)
        coordToCircuit.set(coord, circuit1)
    }
    //once circuits are merged we discard the second one
    const circuit2Index = circuits.indexOf(circuit2)
    if (circuit2Index !== -1) circuits.splice(circuit2Index, 1)
}
