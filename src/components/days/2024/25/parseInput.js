export function parseInput(input) {    
    const keysAndLocks = input.replaceAll('\r', '').split('\n\n').map(block => {
        let cells = block.split('\n').map(row => row.split(''))
        const map = {}
        for(let y in cells) {
            for(let x in cells[y]) {
                if(cells[y][x] === '#')
                    map[`${x}:${y}`] = '#'
            }
        }
        return map
    })
    const keys = keysAndLocks.filter(key => `0:6` in key)
    const locks = keysAndLocks.filter(lock => `0:0` in lock)
    return [locks, keys]
}
