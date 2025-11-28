export function parseInput(input) {    
    let [patterns, designs] = input.replaceAll('\r', '').split('\n\n')
    patterns = patterns.split(', ')
    designs = designs.split('\n')
    return [patterns, designs];
}
