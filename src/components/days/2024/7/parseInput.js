export function parseInput(input) {
    const rows = input.replaceAll('\r').split('\n')
    const pairs = rows.map(row => row.split(': '))
    for (let pair of pairs) {
        pair[0] = parseInt(pair[0])
        pair[1] = pair[1].split(' ').map(n => parseInt(n))
    }
    const maxN = Math.max(...pairs.map(pair => pair[1].length))
    const minN = Math.min(...pairs.map(pair => pair[1].length))
    return [{pairs, maxN, minN}]
}
