export function parseInput(input) {   
    let [registers, program] = input.replaceAll('\r', '').split('\n\n') 
    const [A, B, C] = registers.split('\n').map(r => parseInt(r.split(': ')[1]))
    program = program.split(': ')[1].split(',').map(el => parseInt(el))
    return [A, B, C, program];
}
