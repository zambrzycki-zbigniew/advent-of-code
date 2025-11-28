export function solvePart1(input) {
    const { expanded, files, emptySpaces } = input
    const fixedExpanded = [...expanded]
    const reversedFiles = files.reverse()
    for (let i = 0; i < emptySpaces.length; i++) {
        let fileIndex = reversedFiles[i]
        let fileId = expanded[reversedFiles[i]]
        let emptyIndex = emptySpaces[i]
        if (emptyIndex < fileIndex) {
            fixedExpanded[emptyIndex] = fileId
            fixedExpanded[fileIndex] = null
        }
    }
    let sum = 0
    for (let i = 0; i < fixedExpanded.length; i++) {
        if (fixedExpanded[i]) sum += i * fixedExpanded[i]
    }
    return sum;
}

export function solvePart2(input) {
    const { expanded, emptySpaceSizes, fileSizes, highestId } = input
    const fixedExpanded = [...expanded]
    for (let i = highestId; i >= 0; i--) {
        const file = fileSizes[i]
        const firstEmptySpaceBigEnough = emptySpaceSizes.find(emptySpace => emptySpace.size >= file.size && emptySpace.start < file.start)
        if (firstEmptySpaceBigEnough) {
            for (let j = firstEmptySpaceBigEnough.start; j < firstEmptySpaceBigEnough.start + file.size; j++) fixedExpanded[j] = i
            for (let j = file.start; j < file.start + file.size; j++) fixedExpanded[j] = null
            firstEmptySpaceBigEnough.start += file.size
            firstEmptySpaceBigEnough.size -= file.size
        }
    }
    let sum = 0
    for (let i = 0; i < fixedExpanded.length; i++) {
        if (fixedExpanded[i]) sum += i * fixedExpanded[i]
    }
    return sum;
}
