export function solvePart1(...input) {
    const example = input.length === 8
    let biggest = 0
    for (let i = 0; i < input.length; i++) {
        const [x1, y1] = input[i]
        for (let j = i + 1; j < input.length; j++) {
            const [x2, y2] = input[j]
            //area of rectangle by two opposite corners, +1 because coords are inclusive
            const square = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
            biggest = Math.max(square, biggest)
        }
    }
    return biggest;
}

export function solvePart2(...input) {
    //jesus christ and all that is holy
    const example = input.length === 8
    //input is ordered loop (orthogonal), we prebuild edges for later checks
    const edges = buildEdges(input)
    let biggest = 0
    for (let i = 0; i < input.length; i++) {
        const [x1, y1] = input[i]
        for (let j = i + 1; j < input.length; j++) {
            const [x2, y2] = input[j]
            const minx = Math.min(x1, x2)
            const maxx = Math.max(x1, x2)
            const miny = Math.min(y1, y2)
            const maxy = Math.max(y1, y2)
            //keep only rectangles that are fully inside or on polygon
            if (rectangleInsidePolygon(minx, maxx, miny, maxy, edges)) {
                const square = (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1)
                biggest = Math.max(square, biggest)
            }
        }
    }
    return biggest;
}

function buildEdges(points) {
    //connect each point to next (and last to first) to get polygon edges
    const edges = []
    for (let i = 0; i < points.length; i++) {
        const [x1, y1] = points[i]
        //modulo to make sure that last point connects back to first
        const [x2, y2] = points[(i + 1) % points.length]
        edges.push({ x1, y1, x2, y2, horizontal: y1 === y2 })
    }
    return edges
}

function isPointOnSegment(x, y, edge) {
    //edges are orthogonal, if horizontal then y must match and x must be within the span
    //if vertical then x must match and y within span
    if (edge.horizontal) {
        if (y !== edge.y1) return false
        const minx = Math.min(edge.x1, edge.x2)
        const maxx = Math.max(edge.x1, edge.x2)
        return x >= minx && x <= maxx
    } else {
        if (x !== edge.x1) return false
        const miny = Math.min(edge.y1, edge.y2)
        const maxy = Math.max(edge.y1, edge.y2)
        return y >= miny && y <= maxy
    }
}
function pointInOrOnPolygon(x, y, edges) {
    //if we hit segment, we count as inside
    for (let i = 0; i < edges.length; i++) {
        if (isPointOnSegment(x, y, edges[i])) return true
    }
    //cast a horizontal ray to the right: each time it crosses an edge we flip the inside flag
    //even number of crossings means outside, odd number means inside
    let inside = false
    for (let i = 0; i < edges.length; i++) {
        const { x1, y1, x2, y2 } = edges[i]
        //we count a crossing when the edge goes above and below y
        //our ray starts left of where it would meet that edge
        const intersects = (y1 > y) !== (y2 > y) && x < ((x2 - x1) * (y - y1)) / (y2 - y1) + x1
        if (intersects) inside = !inside
    }
    return inside
}

function rectangleInsidePolygon(minx, maxx, miny, maxy, edges) {
    //all four corners must be inside/on edges
    const corners = [[minx, miny], [maxx, miny], [maxx, maxy], [minx, maxy]]
    for (let i = 0; i < corners.length; i++) {
        if (!pointInOrOnPolygon(corners[i][0], corners[i][1], edges)) return false
    }
    //and polygon edges must not slice through inside
    for (let i = 0; i < edges.length; i++) {
        const edge = edges[i]
        if (edge.horizontal) {
            const y = edge.y1
            if (y > miny && y < maxy) {
                const exmin = Math.min(edge.x1, edge.x2)
                const exmax = Math.max(edge.x1, edge.x2)
                const overlapLeft = Math.max(exmin, minx)
                const overlapRight = Math.min(exmax, maxx)
                if (overlapRight > overlapLeft) return false
            }
        } else {
            const x = edge.x1
            if (x > minx && x < maxx) {
                const eymin = Math.min(edge.y1, edge.y2)
                const eymax = Math.max(edge.y1, edge.y2)
                const overlapBottom = Math.max(eymin, miny)
                const overlapTop = Math.min(eymax, maxy)
                if (overlapTop > overlapBottom) return false
            }
        }
    }
    return true
}
