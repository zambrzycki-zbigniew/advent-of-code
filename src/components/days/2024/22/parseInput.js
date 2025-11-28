export function parseInput(input) {    
    return input.replaceAll(`\r`, ``).split(`\n`).map(Number)
}
