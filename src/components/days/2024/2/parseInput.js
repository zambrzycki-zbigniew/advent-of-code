export function parseInput(input) {
    const rows = input.split('\n')
    const reports = rows.map(row => row.split(' ').map(str => parseInt(str)))
    return reports
}