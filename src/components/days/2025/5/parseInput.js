export function parseInput(input) {
    const [freshRangesString, ingredientIdsString] = input.split('\n\n')
    //we want everything sorted when playing with ranges
    const ingredientIds = ingredientIdsString.split('\n').map(Number).sort((a, b) => a - b)
    const freshRangesRaw = freshRangesString.split('\n').map(rangeString => {
        const [start, end] = rangeString.split('-').map(Number)
        return { start, end }
    })
    //unless there is something else that characterizes the ranges, we usually want any overlaps merged
    const freshRanges = []
    const freshRangesSorted = freshRangesRaw.toSorted((a, b) => a.start - b.start)
    //the first range is one with the lowest start id, and the next one will be one with the next lowest start id
    let currentRange = { ...freshRangesSorted[0] }
    let i = 1
    while (i < freshRangesSorted.length) {
        let nextRange = freshRangesSorted[i]
        //we already know that current range start is lower or equal to next range start
        //so we check if the next range is within the current range, so we know we will merge them
        while (currentRange.end >= nextRange.start) {
            //we merge by extending the current range up to the next range end
            if (currentRange.end < nextRange.end) currentRange.end = nextRange.end
            i++
            //if there's still something to check
            if (i < freshRangesSorted.length) nextRange = freshRangesSorted[i]
            else break;
        }
        //current range is now merged with all overlapping ranges so far
        freshRanges.push(currentRange)
        //last nextRange is the first range that didn't overlap or it's the last range on the list
        currentRange = nextRange
    }
    return [freshRanges, ingredientIds];
}
