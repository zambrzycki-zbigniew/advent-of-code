export function parseInput(input) {    
    const [rawMap, rawMoves] = input.replaceAll("\r", '').split('\n\n')
    const mapList = rawMap.split('\n').map(row => row.split(''))
    const scaledMapList = rawMap.split('\n').map(row => row.split('').map(tile => {
        if(tile === '#') return '##'
        if(tile === 'O') return '[]'
        if(tile === '.') return '..'
        if(tile === '@') return '@.'
    }).join('').split(''))
    const scaledMap = {}
    const map = {}
    let robot = ''
    let scaledRobot = ''
    for(let y in mapList) {
        for(let x in mapList[y]) {
            map[`${x}:${y}`] = mapList[y][x]
            if(mapList[y][x] === '@') robot = `${x}:${y}`
        }
    }
    for(let y in scaledMapList) {
        for(let x in scaledMapList[y]) {
            scaledMap[`${x}:${y}`] = scaledMapList[y][x]
            if(scaledMapList[y][x] === '@') scaledRobot = `${x}:${y}`
        }
    }
    const moves = rawMoves.replaceAll('\n', '').split('')
    return [map, moves, robot, scaledRobot, scaledMap]
}
