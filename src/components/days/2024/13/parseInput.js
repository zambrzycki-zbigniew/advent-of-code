export function parseInput(input) {    
    const machines = input.replaceAll('\r', '').split('\n\n').map(machine => machine.split('\n')).map(([A, B, prize]) => {
       [A, B] = [A, B].map(button => {
        let [x, y] = button.split(": ")[1].split(", ").map(m => parseInt(m.split("+")[1]))
        return {x, y}
       })
       let [x, y] = prize.split(": ")[1].split(", ").map(m => parseInt(m.split("=")[1]))
       return {A, B, prize: {x, y}}
    })
    return machines
}
