export function parseInput(input) {    
    const [mapSize, robotsRaw] = input.replaceAll('\r', '').split('\n\n')
    const [mapX, mapY] = mapSize.split(", ").map(n => parseInt(n))
    const robots = robotsRaw.split('\n').map(row => {
        const [p, v] = row.split(' ').map(raw => {
            const [x, y] = raw.split('=')[1].split(',').map(n => parseInt(n))
            return {x, y}
        })
        return {p, v}
    })
    return [mapX, mapY, robots];
}
