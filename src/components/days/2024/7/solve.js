export function solvePart1(input) {
    let total = 0
    const { pairs, minN, maxN } = input
    let combinations = generateCombinationsForRange(minN - 1, maxN - 1, 2)
    for (let [result, variables] of pairs) {
        let partial = 0
        for (let combination of combinations[variables.length - 1]) {
            partial = parseInt(variables[0])
            for (let i = 1; i < variables.length; i++) {
                if (combination[i - 1] === 0) partial += parseInt(variables[i])
                else partial *= parseInt(variables[i])
            }
            if (parseInt(partial) === parseInt(result)) break;
        }
        if (partial === result) {
            total += result
        }
    }
    return total;
}

export function solvePart2(input) {
    let total = 0
    const { pairs, minN, maxN } = input
    let combinations = generateCombinationsForRange(minN - 1, maxN - 1, 3)
    for (let [result, variables] of pairs) {
        let partial = 0
        for (let combination of combinations[variables.length - 1]) {
            partial = parseInt(variables[0])
            for (let i = 1; i < variables.length; i++) {
                if (combination[i - 1] === 0) partial += parseInt(variables[i])
                if (combination[i - 1] === 1) partial *= parseInt(variables[i])
                else if (combination[i - 1] === 2) {
                    partial = parseInt(String(partial) + String(variables[i]))
                }
            }
            if (parseInt(partial) === parseInt(result)) break;
        }
        if (partial === result) {
            total += result
        }
    }
    return total;
}

function generateCombinationsForRange(minN, maxN, options) {
    let fn = generateCombinations
    const combinations = {}
    for (let n = minN; n <= maxN; n++) {
        combinations[n] = fn(n, options)
    }
    return combinations
}

function generateCombinations(length, base) {
    const total = Math.pow(base, length)
    const result = []
    for (let i = 0; i < total; i++) {
        //i is the unique number of the combination in numerical base 10, each number from 0 to total is unique by nature
        //that means you can get an unique combination of numbers from 0 to base-1 if you convert the decimal number to the
        //base number and pad the start with 0 up to the number of elements in the combination
        //this solution is actually significantly slower than converting those values using modulo and integer division operations,
        //but I used it because it's much easier to explain and took less than 2x time to generate those combinations
        //the alternative would be something like:
        //  const combination = []
        //  let v = i
        //  for (let j = 0; j < length; j++) {
        //      combination.push(v % base)
        //      v = Math.floor(v / base)
        //  }
        const combination = i.toString(base).padStart(length, "0").split("").map(Number)
        result.push(combination)
    }
    return result
}