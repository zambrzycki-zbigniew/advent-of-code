export function solvePart1(input) {
    const { antennas, antennasMap } = input
    const antinodesMap = {}
    for (let frequency in antennas) {
        for (let i = 0; i < antennas[frequency].length; i++) {
            for (let j = i + 1; j < antennas[frequency].length; j++) {
                const [p1, p2] = [antennas[frequency][i], antennas[frequency][j]]
                const [x1, y1] = p1.split(':').map(c => parseInt(c))
                const [x2, y2] = p2.split(':').map(c => parseInt(c))
                const [dx, dy] = [x2 - x1, y2 - y1]
                const antinodes = [`${x2 + dx}:${y2 + dy}`, `${x1 - dx}:${y1 - dy}`]
                antinodes.forEach(antinode => {
                    if (antennasMap[antinode]) {
                        antinodesMap[antinode] = true
                    }
                })

            }
        }
    }
    return Object.keys(antinodesMap).length;
}

export function solvePart2(input) {
    const { antennas, antennasMap } = input
    const antinodesMap = {}
    for (let frequency in antennas) {
        for (let i = 0; i < antennas[frequency].length; i++) {
            for (let j = i + 1; j < antennas[frequency].length; j++) {
                const [p1, p2] = [antennas[frequency][i], antennas[frequency][j]]
                const [x1, y1] = p1.split(':').map(c => parseInt(c))
                const [x2, y2] = p2.split(':').map(c => parseInt(c))
                let [dx, dy] = [x2 - x1, y2 - y1]
                const gcd = greatestCommonDivisor(dx, dy)
                dx = dx / gcd
                dy = dy / gcd
                let antinode1 = p1
                while (antennasMap[antinode1]) {
                    antinodesMap[antinode1] = true
                    const [x, y] = antinode1.split(':').map(c => parseInt(c))
                    antinode1 = `${x - dx}:${y - dy}`
                }
                let antinode2 = p2
                while (antennasMap[antinode2]) {
                    antinodesMap[antinode2] = true
                    const [x, y] = antinode2.split(':').map(c => parseInt(c))
                    antinode2 = `${x + dx}:${y + dy}`
                }
            }
        }
    }
    return Object.keys(antinodesMap).length;
}

function greatestCommonDivisor(a, b) {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b !== 0) {
        const temp = b
        b = a % b
        a = temp
    }
    return a
}