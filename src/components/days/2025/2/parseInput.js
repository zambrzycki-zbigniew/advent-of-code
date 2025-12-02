export function parseInput(input) {    
    const ranges = input.replaceAll('\n').split(',').map(stringRange => {
        const [start, end] = stringRange.split('-');
        return [start, end]
    })
    return ranges;
}
