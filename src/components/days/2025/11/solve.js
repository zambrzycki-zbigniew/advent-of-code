export function solvePart1(...input) {
    const graph = input[0]
    // const example = Object.keys(graph).length === 10
    return countPathsLeadingFromTo('you', 'out', graph);
}

export function solvePart2(...input) {
    const graph = input[0]
    const example = Object.keys(graph).length === 13
    console.log(graph);
    const start = 'svr'
    const r1 = 'dac'
    const r2 = 'fft'
    const out = 'out'

    let count = 0
    // if (example) {
    let countSR1 = countPathsLeadingFromTo(start, r1, graph)
    console.log(`from ${start} to ${r1}: `, countSR1);
    let countSR2 = countPathsLeadingFromTo(start, r2, graph)
    console.log(`from ${start} to ${r2}: `, countSR2);
    let countR1R2 = countPathsLeadingFromTo(r1, r2, graph)
    console.log(`from ${r1} to ${r2}: `, countR1R2);
    let countR2R1 = countPathsLeadingFromTo(r2, r1, graph)
    console.log(`from ${r2} to ${r1}: `, countR2R1);
    let countR1O = countPathsLeadingFromTo(r1, out, graph)
    console.log(`from ${r1} to ${out}: `, countR1O);
    let countR2O = countPathsLeadingFromTo(r2, out, graph)
    console.log(`from ${r2} to ${out}: `, countR2O);
    count = countSR1 * countR1R2 * countR2O + countSR2 * countR2R1 * countR1O
    // }
    return count;
}

// function countPathsLeadingFromTo(from, to, graph, end = 'out') {
//     let count = 0
//     const queue = [{ current: from, visited: new Set() }]
//     while (queue.length > 0) {
//         const { current, visited } = queue.pop()
//         if (current === end) continue
//         let next = graph[current].filter(n => !visited.has(n))
//         if (next.includes(to)) { count++; next = next.filter(n => n !== to); }
//         const newVisited = new Set(visited)
//         newVisited.add(current)
//         queue.push(...next.map(n => ({ current: n, visited: newVisited })))
//     }
//     return count
// }

//only sensible usage of recursion in existence (probably)
function countPathsLeadingFromTo(from, to, graph, end = 'out') {
    //we keep the results of all node traversals here
    //if we get to a node that we already got the answer from then we can stop
    const memo = new Map()
    function dfs(node) {
        if (node === end) return 0
        if (memo.has(node)) return memo.get(node)
        const neighbors = graph[node] || []
        let count = 0
        for (const next of neighbors) {
            //if we're there we're there
            if (next === to) {
                count++
            } else {
                //if not then maybe we'll eventually get there, keep looking
                count += dfs(next)
            }
        }
        //all found results save to global memoization map so they can be reused in case we get to the same node again
        memo.set(node, count)
        return count
    }
    return dfs(from)
}