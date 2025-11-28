export function solvePart1(input) {
    const pairs = input.split('mul(').map((str, ind) => {
        if (ind === 0) return null
        let bracketIndex = str.indexOf(")")
        if (bracketIndex <= 2) return null
        let cutStr = str.slice(0, bracketIndex)
        let pair = cutStr.split(',')
        if (pair.length === 1) return null
        if (!pair.every(el => {
            for (let char of el) {
                if (char < '0' || char > '9') {
                    return false
                }
            }
            return el.length > 0 && el.length < 4
        })) return null
        pair = pair.map(el => parseInt(el))
        return pair
    }).filter(pair => pair !== null)
    let results = pairs.map(pair => pair[0] * pair[1])
    return results.reduce((sum, result) => sum + result, 0)
}

export function solvePart2(input) {
    const rejected = []
    let dos = [-1, ...findSubstringIndices(input, "do()")]
    let donts = findSubstringIndices(input, "don't()")
    dos.sort((a, b) => a - b);
    donts.sort((a, b) => a - b);
    let muls = findSubstringIndices(input, "mul(").filter(mul => {
        let smallerClosestDo = Math.max(...dos.filter(d => d < mul))
        let smallerClosestDont = Math.max(...donts.filter(d => d < mul))
        return smallerClosestDo > smallerClosestDont
    })
    const pairs = muls.map((index, mulIndex) => {
        let nextIndex = muls[parseInt(mulIndex) + 1]
        let str = nextIndex ? input.slice(index+4, nextIndex) : input.slice(index+4)
        let bracketIndex = str.indexOf(")")
        if (bracketIndex <= 2) return null
        let cutStr = str.slice(0, bracketIndex)
        let pair = cutStr.split(',')
        if (pair.length === 1) return null
        if (!pair.every(el => {
            for (let char of el) {
                if (char < '0' || char > '9') {
                    return false
                }
            }
            return el.length > 0 && el.length < 4
        })) return null
        pair = pair.map(el => parseInt(el))
        return pair
    }).filter(pair => pair !== null)
    let results = pairs.map(pair => pair[0] * pair[1])
    return results.reduce((sum, result) => sum + result, 0)
}

function findSubstringIndices(str, substring) {
    const indices = [];
    let index = str.indexOf(substring)
    while (index !== -1) {
        indices.push(index);
        index = str.indexOf(substring, index + 1)
    }
    return indices;
}