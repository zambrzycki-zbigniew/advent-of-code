export function solvePart1(patterns, designs) {
    let possibleDesigns = 0
    for (let design of designs) {
        const availablePatterns = patterns.filter(pattern => design.includes(pattern))
        const startingPatterns = availablePatterns.filter(pattern => design.startsWith(pattern))
        const stack = [...startingPatterns.map(startingPattern => design.replace(startingPattern, ''))]
        const alreadyVisited = new Set()
        while (stack.length > 0) {
            const subdesign = stack.pop()
            if (alreadyVisited.has(subdesign)) continue
            alreadyVisited.add(subdesign)
            const availableSubpatterns = availablePatterns.filter(pattern => subdesign.includes(pattern))
            const startingSubpatterns = availableSubpatterns.filter(pattern => subdesign.startsWith(pattern))
            const nextSubdesigns = startingSubpatterns.map(startingPattern => subdesign.replace(startingPattern, ''))
            if (nextSubdesigns.some(subdesign => subdesign.length === 0)) {
                possibleDesigns++
                break;
            }
            stack.push(...nextSubdesigns)
        }
    }
    return possibleDesigns;
}

export function solvePart2(patterns, designs) {
    const cache = {}
    let possibleDesigns = 0
    for (let design of designs) {
        const availablePatterns = patterns.filter(pattern => design.includes(pattern))
        const startingPatterns = availablePatterns.filter(pattern => design.startsWith(pattern))
        for (let pattern of startingPatterns) {
            const subdesign = design.slice(pattern.length)
            possibleDesigns += countPaths(subdesign, availablePatterns, cache)
        }
    }
    return possibleDesigns
}

function countPaths(design, availablePatterns, cache) {
    if (design.length === 0) return 1
    if (design in cache) return cache[design]
    let totalPaths = 0
    for (let pattern of availablePatterns) {
        if (design.startsWith(pattern)) {
            const subdesign = design.slice(pattern.length)
            totalPaths += countPaths(subdesign, availablePatterns, cache)
        }
    }
    cache[design] = totalPaths
    return totalPaths
}