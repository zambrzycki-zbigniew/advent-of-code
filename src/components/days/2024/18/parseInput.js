export function parseInput(input) {
    const [fallenString, size, blocks] = input.split('\n\n')
    const blockades = blocks.replaceAll('\r', '').split('\n').map(el => el.split(',')).map(([x, y]) => ({x: parseInt(x), y: parseInt(y)}))
    const [xSize, ySize] = size.split('x').map(Number)
    const map = {}
    const graph = {}
    const helperGraph = {}
    const fallen = parseInt(fallenString)
    for(let i = 0; i < fallen; i++) {
        let {x, y} = blockades[i]
        map[`${x}:${y}`] = '#'
    }
    for(let x = 0; x < xSize; x++) {
        for(let y = 0; y < ySize; y++) {
            if(!map[`${x}:${y}`]) map[`${x}:${y}`] = '.'
        }
    }
    for(let x = 0; x < xSize; x++) {
        for(let y = 0; y < ySize; y++) {
            if(map[`${x}:${y}`] !== '#') {
                graph[`${x}:${y}`] = {}
                getNeighbours(x, y, map).forEach(neighbour => {
                    graph[`${x}:${y}`][neighbour] = 1
                    if(!helperGraph[neighbour]) helperGraph[neighbour] = []
                    helperGraph[neighbour].push(`${x}:${y}`)
                })
            }
        }
    }
    console.log(blockades)
    return [graph, `0:0`, `${xSize-1}:${ySize-1}`, blockades.slice(fallen), helperGraph]
}

function getNeighbours(x, y, map) {
    return [
        `${x}:${y-1}`, //N
        `${x+1}:${y}`, //E
        `${x}:${y+1}`, //S
        `${x-1}:${y}`, //W
    ].filter(n => map[n] && map[n] !== '#')
}