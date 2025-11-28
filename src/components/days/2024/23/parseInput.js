export function parseInput(input) {
    const connections = input.replaceAll(`\r`).split(`\n`).map(row => row.split('-'))
    const graph = {}
    const knownGroups = new Set()
    const knownGroupsWithT = new Set()
    for (let [pc1, pc2] of connections) {
        if (!graph[pc1]) graph[pc1] = {}
        if (!graph[pc2]) graph[pc2] = {}
        graph[pc1][pc2] = 1
        graph[pc2][pc1] = 1
    }
    for (let pc1 in graph) {
        for (let pc2 in graph[pc1]) {
            let commonPcs = Object.keys(graph[pc1]).filter(pc => pc in graph[pc2])
            if (commonPcs.length > 0) {
                for (let commonPc of commonPcs) {
                    const group = [pc1, pc2, commonPc].sort().join(',')
                    knownGroups.add(group)
                    if (pc1.charAt(0) === 't' || pc2.charAt(0) === 't' || commonPc.charAt(0) === 't') knownGroupsWithT.add(group)
                }
            }
        }
    }
    return [graph, Array.from(knownGroups).sort(), Array.from(knownGroupsWithT).sort(), connections]
}