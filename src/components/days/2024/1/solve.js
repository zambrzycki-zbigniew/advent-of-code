export function solvePart1(list1, list2) {
    list1.sort((a, b) => b - a)
    list2.sort((a, b) => b - a)
    let result = 0
    for (let index in list1) {
        result += Math.abs(list1[index] - list2[index])
    }
    return result
}

export function solvePart2(list1, list2) {
    let similarityScore = 0
    let foundNumbers = {}
    for (let index in list1) {
        if (!foundNumbers[list1[index]])
            foundNumbers[list1[index]] = list1[index] * list2.filter(n => n === list1[index]).length
        similarityScore += foundNumbers[list1[index]]
    }
    return similarityScore
}