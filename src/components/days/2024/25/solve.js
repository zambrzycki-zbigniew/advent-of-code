export function solvePart1(locks, keys) {
    let overlaps = new Set()
    for(let l in locks) {
        for(let k in keys) {
            if(!Object.keys(keys[k]).some(cell => cell in locks[l])) overlaps.add(`${l}:${k}`)
        }
    }
    return overlaps.size
}

export function solvePart2(locks, keys) { 
    console.log(locks, keys);
    return null;
}
