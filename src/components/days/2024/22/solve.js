export function solvePart1(...secrets) {
    let sum = 0n
    for (let secret of secrets.map(BigInt)) {
        for (let i = 0; i < 2000; i++) secret = evolve(secret)        
        sum += secret
    }
    return Number(sum)
}

export function solvePart2(...secrets) {
    const allDiffs = new Map()
    let highestDiff = null
    let highestDiffVal = -Infinity
    for (let secret of secrets.map(BigInt)) {
        const buyerDiffs = new Map()
        const diffsQueue = []
        for (let i = 0; i < 2000; i++) {
            let price, diff
            [secret, price, diff] = evolvePrices(secret)
            diffsQueue.push(diff)
            if (diffsQueue.length > 4) diffsQueue.shift()
            if (diffsQueue.length === 4) {
                const last4diffs = diffsQueue.join(',')
                if (!buyerDiffs.has(last4diffs)) buyerDiffs.set(last4diffs, price)
            }
        }
        buyerDiffs.forEach((price, diff) => {
            allDiffs.set(diff, (allDiffs.get(diff) || 0n) + price)
            if (allDiffs.get(diff) > highestDiffVal) {
                highestDiff = diff
                highestDiffVal = allDiffs.get(diff)
            }
        })
    }
    return Number(highestDiffVal)
}



function evolve(secret) {
    const a = secret * 64n
    secret ^= a
    secret %= 16777216n
    const b = BigInt(Math.floor(Number(secret) / 32))
    secret ^= b
    secret %= 16777216n
    const c = secret * 2048n
    secret ^= c
    secret %= 16777216n
    return secret
}


function evolvePrices(secret) {
    let previousPrice = secret % 10n
    secret = evolve(secret)
    return [secret, secret % 10n, (secret % 10n) - previousPrice]
}