export function parseInput(input) {    
    const rows = input.split('\n').map(el => {
        const trimmedRow = el.trim()
        const direction = trimmedRow.substring(0,1)
        const count = Number(trimmedRow.substring(1))
        return {direction, count}
    });
    return rows;
}
