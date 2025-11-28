// export function solvePart1(codes, numericKeypad, directionalKeypad) {
//     let sum = 0
//     const currentButtons = ["A", "A", "A"]
//     const pads = [numericKeypad, directionalKeypad, directionalKeypad]
//     for (let { parts, number } of codes) {
//         let totalPath = ""
//         for (let part of parts) {
//             let path = part
//             for (let bot in currentButtons) {
//                 const current = currentButtons[bot]
//                 const pad = pads[bot]
//                 let tmpPath = path
//                 path = ""
//                 for (let char of tmpPath) {
//                     path += pad[currentButtons[bot]].pathTo[char] + "A"
//                     // if (parts.join('') === '029A') console.log(`path from ${currentButtons[bot]} to ${char} for bot ${bot}: ${pad[currentButtons[bot]].pathTo[char]}, total path for bot: ${path}`)
//                     currentButtons[bot] = char
//                 }
//                 // if (parts.join('') === '029A') console.log(`${currentButtons[bot]} => ${part}, bot: ${bot}, current bot position: ${currentButtons[bot]}, path: ${path}`)
//             }
//             // path += "A"
//             totalPath += path
//         }
//         // totalPath += "A"
//         sum += number * totalPath.length
//         // if (parts.join('') === '029A') {
//         //     console.log('<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A')
//         //     console.log(totalPath)
//         // }
//     }
//     return sum;
// }

export function solvePart1(codes, numericKeypad, directionalKeypad) {
    let sum = 0
    const currentButtons = Array(3).fill("A")
    const pads = [numericKeypad, ...Array(2).fill(directionalKeypad)]
    const cache = {}
    for (let { parts, number } of codes) {
        let subsum = 0
        for (let part of parts)
            subsum += calculateLength(0, part, cache, currentButtons, pads)
        sum += number * subsum
    }
    return sum
}

export function solvePart2(codes, numericKeypad, directionalKeypad) {
    console.log(codes, numericKeypad, directionalKeypad)
    let sum = 0
    const currentButtons = Array(26).fill("A")
    const pads = [numericKeypad, ...Array(25).fill(directionalKeypad)]
    const cache = {}
    for (let { parts, number } of codes) {
        let subsum = 0
        for (let part of parts) 
            subsum += calculateLength(0, part, cache, currentButtons, pads)
        sum += number * subsum
    }
    return sum;
}

function calculateLength(depth, char, cache, currentButtons, pads) {
    const cacheKey = `${depth}:${currentButtons[depth]} => ${char}`
    const current = currentButtons[depth] 
    currentButtons[depth] = char
    if (cache[cacheKey]) return cache[cacheKey]
    const pad = pads[depth]
    const path = pad[current].pathTo[char] + "A"
    if (pads[depth + 1]) cache[cacheKey] = path.split('').reduce((sum, c) => sum + calculateLength(depth + 1, c, cache, currentButtons, pads), 0)
    else cache[cacheKey] = path.length
    return cache[cacheKey]
}
