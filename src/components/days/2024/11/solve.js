export function solvePart1(input) {
    let stones = [...input]
    let blinks = 0
    while (blinks < 25) {
        blinks++
        let newStones = []
        for (let stone of stones) {
            if (stone === '0') newStones.push('1')
            else if (stone.length % 2 === 0) newStones.push(stone.slice(0, stone.length / 2), String(parseInt(stone.slice(stone.length / 2)))
            )
            else newStones.push(String(parseInt(stone) * 2024))
        }
        stones = newStones
    }
    return stones.length;
}

export function solvePart2(input) {
    return countingStones5(input, 75)
}

function countingStones5(input, count) {
    const memo = new Map()
    let totalStones = 0;
    for (let i = 0; i < input.length; i++) {
        totalStones += computeFor(input[i], 0, count, memo)
    }
    return totalStones
}

function computeFor(stone, startFrom, count, memo) {
    const key = stone + ':' + startFrom
    if (memo.has(key)) {
        return memo.get(key)
    }
    let totalStones = 1
    let current = stone
    for (let blink = startFrom; blink < count; blink++) {
        if (current === '0') current = '1'
        else if (current.length % 2 === 0) {
            const newStone = String(parseInt(current.slice(current.length / 2), 10))
            totalStones += computeFor(newStone, blink + 1, count, memo)
            current = current.slice(0, current.length / 2)
        } else current = String(parseInt(current, 10) * 2024)
    }
    memo.set(key, totalStones)
    return totalStones
}