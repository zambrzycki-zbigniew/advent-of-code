export function parseInput(input) {   
    const rows = input.split('\n').map(row => row.split(': ')).reduce((obj, node) => {
        obj[node[0]] = node[1].split(' ');
        return obj
    }, {})
    // .map((row => ({[row[0]]: row[1].split(' ')})))
    return [rows];
}
