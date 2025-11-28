export function parseInput(input) {
    const [rawInitialWires, rawConnections] = input.replaceAll(`\r`, '').split(`\n\n`).map(el => el.split('\n'))
    const wires = {}
    const connections = rawConnections.map(connection => connection.split(' ').filter(c => c !== "->"))
    for(let [w1, op, w2, w3] of connections) {
        wires[w1] = null
        wires[w2] = null
        wires[w3] = null
    }
    for(let wire of rawInitialWires) {
        const [name, value] = wire.split(': ')
        wires[name] = parseInt(value)
    }
    return [wires, connections];
}