export function solvePart1(...input) {
    let sum = 0
    for (let [start, end] of input) {
        //skip exclusively odd orders of magnitude, none of those can be mirrored
        if (start.length === end.length && start.length % 2 === 1) continue;
        const startNumber = Number(start)
        const endNumber = Number(end)
        let half = Number(start.substring(0, start.length / 2))
        let firstFaultyId = Number(`${half}${half}`)
        //it can be 1111 out of 1199, in which case it needs to go to 1212, or it can be 11 out of 119, so it needs to iterate to 1010
        //it's at most 10 iterations
        while (firstFaultyId < startNumber) {
            half++
            firstFaultyId = Number(`${half}${half}`)
        }
        let currentNumber = firstFaultyId
        //difference between start and end is 1 order of magnitude at most, and we're iterating over numbers half orders of magnitude smaller
        //it will take at most number of iterations within half orders of magnitude of original numbers to finish
        while (currentNumber <= endNumber) {
            sum += currentNumber
            half++
            currentNumber = Number(`${half}${half}`)
        }
    }
    return sum;
}

export function solvePart2(...input) {
    console.log(input);
    let sum = 0
    for (let [start, end] of input) {
        const startNumber = Number(start)
        const endNumber = Number(end)
        let current = startNumber
        //I didn't actually expect this to work or be instant, but somehow it did and it was
        //~2.6 milion iterations
        //why fix if work???
        while (current <= endNumber) {
            const sCurrent = String(current)
            //any repeating pattern would be exposed if mirrored string contained initial string somewhere else
            //than at the start or the halfpoint. mirror 123123123 => 123123123123123123 => 123{123123123}123123
            if (`${sCurrent}${sCurrent}`.indexOf(sCurrent, 1) !== sCurrent.length) sum += current
            current++
        }
    }
    return sum;
}
