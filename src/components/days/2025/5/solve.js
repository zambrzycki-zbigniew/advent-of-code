export function solvePart1(...input) {
    const [freshRanges, ingredientIds] = input
    let fresh = 0
    const example = ingredientIds.length === 6
    //also works but is much slower, ~2ms compared to ~0.2ms, O(n*m) instead of O(n+m)
    // for (const ingredientId of ingredientIds) {
    //     if (freshRanges.some(({ start, end }) => start <= ingredientId && ingredientId <= end)) fresh++
    // }
    let i = 0
    let j = 0
    while (i < freshRanges.length) {
        //we're iterating through all ranges (sorted)
        const { start, end } = freshRanges[i]
        while (j < ingredientIds.length) {
            //we're iterating through all ingredients (sorted)
            const ingredientId = ingredientIds[j]
            //due to sorting, if ingredient id is lower than the start of currently checked range
            //it won't fit in any other range
            if(ingredientId < start) { j++; continue; }
            //if it fits it's fresh
            if (start <= ingredientId && ingredientId <= end) fresh++;
            //if it doesn't fit and it's beyond the current range, we switch range
            else if(ingredientId > end) break;
            //we go to next ingredient
            j++;            
        }
        //we go to the next range
        i++
    }
    return fresh;
}

export function solvePart2(...input) {
    const freshRanges = input[0]
    let fresh = 0
    //within range 5 - 10 there are id's 5, 6, 7, 8, 9 and 10, so 10 - 5 + 1
    //great explaination of off-by-one error or fence post problem
    //https://www.youtube.com/watch?v=FAdmpAZTH_M 
    for (let { start, end } of freshRanges) fresh += end - start + 1
    return fresh;
}
