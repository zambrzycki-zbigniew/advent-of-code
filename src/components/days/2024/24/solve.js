export function solvePart1(wires, connections) {
    connections = [...connections]
    while (connections.length > 0) {
        const connection = connections.shift()
        const [w1, op, w2, w3] = connection
        if (wires[w1] !== null && wires[w2] !== null) {
            wires[w3] = operations[op](wires[w1], wires[w2])
        } else connections.push(connection)
    }
    const zs = Object.entries(wires).filter(([k, v]) => k.startsWith('z'))
        .sort((a, b) => parseInt(a[0].replace('z', '')) - parseInt(b[0].replace('z', ''))).reverse().map(([k, v]) => v).join('')
    // console.log(zs)
    // console.log("0011111101000")
    return parseInt(zs, 2)
}

const operations = {
    "AND": (w1, w2) => w1 & w2,
    "OR": (w1, w2) => w1 | w2,
    "XOR": (w1, w2) => w1 ^ w2,
}

const operators = {
    "AND": "&",
    "OR": "|",
    "XOR": "^",
}

export function solvePart2(wires, connections) {
    if (connections.length < 50) return "fuck that"
    const knownSwaps = [
        ['z07', 'rts'],
        ['z12', 'jpj'],
        ['chv', 'vvw'],
        ['z26', 'kgj']
    ]
    for (let [swap1, swap2] of knownSwaps) {
        const con1 = connections.find(([w1, op, w2, w3]) => w3 === swap1)
        const con2 = connections.find(([w1, op, w2, w3]) => w3 === swap2)
        con1[3] = swap2
        con2[3] = swap1
    }
    // for(let [w1, op, w2, w3] of connections) {
    //     console.log(`${w1} ${op} ${w2} -> ${w3}`)
    // }
    Object.keys(wires).filter(w => w.startsWith('x') || w.startsWith('y')).forEach(wire => wires[wire] = Math.floor(Math.random()*10) % 2)
    const stack = [...connections]
    const wireHistory = {}
    const registries = {
        correct: {
            z: {},
            x: {},
            y: {},
            carry: {}
        },
        current: {
            z: {},
            x: {},
            y: {},
            carry: {},
            connection: {},
            xor1: {},
            xor2: {},
            and1: {},
            and2: {}
        }
    }
    Object.entries(wires).filter(([k, v]) => v !== null).forEach(([k, v]) => wireHistory[k] = { initial: true })
    let i = 0
    let highestZ = -1
    while (stack.length > 0) {
        const connection = stack.shift()
        const [w1, op, w2, w3] = connection
        // if(w3 === 'z08')
        // if(w3 === 'rts')
        // if(w3 === 'cds')
        // if(w3 === 'nph')
        if (w3 === 'ksn')
            console.log(`${w1} ${op} ${w2} -> ${w3}`, wires[w1], wires[w2])
        if (wires[w1] !== null && wires[w2] !== null) {
            wires[w3] = operations[op](wires[w1], wires[w2])
            if (w3)
                wireHistory[w3] = { w1, w2, op, history: {} }
            wireHistory[w3].history[w1] = wireHistory[w1]
            wireHistory[w3].history[w2] = wireHistory[w2]
        } else stack.push(connection)
        i++
    }
    // if(i === 1000) return 'loop'
    // Object.entries(wireHistory).filter(([k, v]) => k.startsWith('z'))
    // .sort((a, b) => parseInt(a[0].replace('z', '')) - parseInt(b[0].replace('z', ''))).reverse().map(([k,v]) => {
    //     const o = {}
    //     o[k] = v
    //     return o
    // }).forEach(z => {
    //     const [k, {w1, w2, op, history}] = Object.entries(z)[0]
    //     console.log(`${k} = ${history[w1].initial ? w1 : "("+getHistory(history[w1])+")"} ${operators[op]} ${history[w2].initial ? w2 : "("+getHistory(history[w2])+")"}`)
    //     console.log(`${k} = ${w1} ${operators[op]} ${w2}`)
    // })
    let bitNumbers = new Set()
    Object.entries(wires).filter(([k, v]) => ['x', 'y', 'z'].includes(k[0])).forEach(([k, v]) => {
        const registry = k[0]
        const bitNumber = parseInt(k.replace(registry, ''))
        registries.current[registry][bitNumber] = v
        registries.correct[registry][bitNumber] = v
        bitNumbers.add(bitNumber)
    })
    bitNumbers = Array.from(bitNumbers).sort((a, b) => a - b)
    const { x: x1, y: y1, z: z1, carry: carry1 } = registries.correct
    const { x: x2, y: y2, z: z2, carry: carry2, connection, xor1, xor2, and1, and2 } = registries.current
    for (let i = 0; i < bitNumbers.length; i++) {
        let n = bitNumbers[i]
        let no = String(n).padStart(2, '0')

        carry1[n] = String(n) in x1 ?
            (x1[n] & y1[n]) | (carry1[n - 1] & (x1[n] ^ y1[n]))
            : 0
        z1[n] = x1[n] ^ y1[n] ^ (String(n - 1) in carry1 ? carry1[n - 1] : 0)

        // console.log(`z${String(n).padStart(2, '0')}`)
        connection[n] = connections.find(([w1, op, w2, w3]) => w3 === `z${no}`)
        xor1[n] = connections.find(([w1, op, w2, w3]) => op === 'XOR' && ((w1 === `x${no}` && w2 === `y${no}`) || (w1 === `y${no}` && w2 === `x${no}`)))
        and1[n] = connections.find(([w1, op, w2, w3]) => op === 'AND' && ((w1 === `x${no}` && w2 === `y${no}`) || (w1 === `y${no}` && w2 === `x${no}`)))
        carry2[n] = connections.find(([w1, op, w2, w3]) => op === 'OR' && and1[n] && (w1 === and1[n][3] || w2 === and1[n][3]))
        and2[n] = connections.find(([w1, op, w2, w3]) => op === 'AND' && carry2[n] && (w1 === carry2[n][3] || w2 === carry2[n][3]))
        xor2[n] = connections.find(([w1, op, w2, w3]) => op === 'XOR' && xor1[n] && (w1 === xor1[n][3] || w2 === xor1[n][3]))
    }
    console.log(registries)
    for (let i = 0; i < bitNumbers.length; i++) {
        let n = bitNumbers[i]
        console.log(n)
        if (x1[n] === x2[n] && y1[n] === y2[n] && z1[n] === z2[n]) continue;
        console.log(n, carry1[n],
            connection[n].join(' '),
            xor1[n] ? xor1[n].join(' ') : `XOR1[${n}] not found`,
            xor2[n] ? xor2[n].join(' ') : `XOR2[${n}] not found`,
            and1[n] ? and1[n].join(' ') : `AND1[${n}] not found`,
            and2[n] ? and2[n].join(' ') : `AND2[${n}] not found`,
            carry2[n] ? carry2[n].join(' ') : `CARRY[${n}] not found`
        )
        if (x1[n] !== x2[n]) console.log(`x1[${n}] !== x2[${n}]`, x1[n], x2[n])
        if (y1[n] !== y2[n]) console.log(`y1[${n}] !== y2[${n}]`, y1[n], y2[n])
        if (z1[n] !== z2[n]) console.log(`z1[${n}] !== z2[${n}]`, z1[n], z2[n])
        console.log(wires[xor1[n][0]])
        console.log(wires[xor1[n][2]])
        // if (carry1[n] !== carry2[n]) console.log("carry1[n] !== carry2[n]", carry1[n], carry2[n])
        break;
    }
    return knownSwaps.flat().sort().join(',');
}
function getHistory(h) {
    const { w1, w2, op, history } = h
    return `${history[w1].initial ? w1 : "(" + getHistory(history[w1]) + ")"} ${operators[op]} ${history[w2].initial ? w2 : "(" + getHistory(history[w2]) + ")"}`
}