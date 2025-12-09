export function parseInput(input) {  
    const rows = input.split('\n').map(row => row.trim().split(',').map(Number))
    return rows;
}
