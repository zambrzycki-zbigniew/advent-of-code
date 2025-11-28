const word = ["X", "M", "A", "S"]
const directions = {
    "top-left": [-1, -1],
    "top": [0, -1],
    "top-right": [1, -1],
    "left": [-1, 0],
    "right": [1, 0],
    "bottom-left": [-1, 1],
    "bottom": [0, 1],
    "bottom-right": [1, 1],
}

export function solvePart1(input) {
    let foundWords = 0
    for (let [key, letter] of Object.entries(input)) {
        const [x, y] = key.split(':').map(num => parseInt(num))
        if (letter === word[0]) {
            foundWords += checkNeighbours(input, x, y)
        }
    }
    return foundWords
}

function checkNeighbours(input, x, y, wordIndex = 0, direction = null) {
    let nextLetter = word[wordIndex + 1]
    let results = 0
    if (!direction) {
        for (let direction of Object.keys(directions)) {
            const [dx, dy] = directions[direction]
            const neighbour = input[`${x + dx}:${y + dy}`]
            if (neighbour && neighbour === nextLetter) results += checkNeighbours(input, x + dx, y + dy, wordIndex + 1, direction)
        }
    } else {
        const [dx, dy] = directions[direction]
        const neighbour = input[`${x + dx}:${y + dy}`]
        if (neighbour && neighbour === nextLetter) {
            if (word[wordIndex + 2])
                return checkNeighbours(input, x + dx, y + dy, wordIndex + 1, direction)
            return 1
        }
        return 0
    }
    return results
}

export function solvePart2(input) {
    let foundWords = 0
    for (let [key, letter] of Object.entries(input)) {
        const [x, y] = key.split(':').map(num => parseInt(num))
        if (letter === 'A') {
            foundWords += checkNeighbours2(input, x, y)
        }
    }
    return foundWords
}

function checkNeighbours2(input, x, y) {
    let neighbourPairs = [
        input[`${x-1}:${y-1}`]+input[`${x+1}:${y+1}`],
        input[`${x+1}:${y-1}`]+input[`${x-1}:${y+1}`]
    ]
    if(neighbourPairs.every(pair => ['SM', 'MS'].includes(pair))) return 1
    return 0
}