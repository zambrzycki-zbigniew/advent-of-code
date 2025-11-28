export function parseInput(input) {
    const diskMap = input.split('').map(el => parseInt(el))
    const expanded = []
    const files = []
    const emptySpaces = []
    const emptySpaceSizes = []
    const fileSizes = {}
    let i = 0
    let currentId = 0
    while (diskMap[i] !== undefined) {
        let element, target
        if (i % 2 === 1) {
            element = null
            target = emptySpaces
            emptySpaceSizes.push({size: diskMap[i], start: expanded.length})
            currentId++
        } else {
            element = currentId
            fileSizes[currentId] = {size: diskMap[i], start: expanded.length}
            target = files
        }
        for (let j = 0; j < diskMap[i]; j++) {
            expanded.push(element)
            target.push(expanded.length - 1)
        }
        i++
    }
    return [{expanded, files, emptySpaces, emptySpaceSizes, fileSizes, highestId: currentId}];
}
