export function solvePart1(...map) {
    const tooMuchNeighbours = 4
    let count = 0
    const coords = []
    for (let y in map) {
        y = Number(y)
        for (let x in map[y]) {
            x = Number(x)
            if (map[y][x] === '@') {
                let neighboursCount = checkNeighbours(y, x, map)
                if (neighboursCount < tooMuchNeighbours) {
                    count++
                    coords.push({ x, y })
                }
            }
        }
    }
    if (map.length === 10) highlightMap(map, coords)
    return count;
}

function checkNeighbours(y, x, map, target = "@") {
    let count = 0
    if (y > 0) {
        if (x > 0) {
            if (map[y - 1][x - 1] === target) count++
        }
        if (map[y - 1][x] === target) count++
        if (x < map[y - 1].length - 1) {
            if (map[y - 1][x + 1] === target) count++
        }
    }
    if (x > 0) {
        if (map[y][x - 1] === target) count++
    }
    if (x < map[y].length - 1) {
        if (map[y][x + 1] === target) count++
    }
    if (y < map.length - 1) {
        if (x > 0) {
            if (map[y + 1][x - 1] === target) count++
        }
        if (map[y + 1][x] === target) count++
        if (x < map[y + 1].length - 1) {
            if (map[y + 1][x + 1] === target) count++
        }
    }
    return count
}

export function solvePart2(...map) {
    // if (map.length > 10) return 0
    const tooMuchNeighbours = 4
    let count = 0
    const coords = []
    let removed
    if (map.length === 10) highlightMap(map, coords)
    while (true) {
        removed = 0
        for (let y in map) {
            y = Number(y)
            for (let x in map[y]) {
                x = Number(x)
                if (map[y][x] === '@') {
                    let neighboursCount = checkNeighbours(y, x, map)
                    if (neighboursCount < tooMuchNeighbours) {
                        count++
                        coords.push({ x, y })
                    }
                }
            }
        }
        for (let { x, y } of coords) {
            if (map[y][x] !== 'X') {
                map[y][x] = 'X'
                removed++
            }
        }
        if (map.length === 10) highlightMap(map, coords)
        if (removed === 0) break;
    }
    if (map.length === 10) highlightMap(map, coords)
    return count;
}

function highlightMap(map, coords) {
    const height = Array.isArray(map) ? map.length : 0
    if (height === 0) {
        console.log('')
        return
    }
    const highlighted = new Set()
    for (const pt of coords || []) {
        const x = pt && pt.x
        const y = pt && pt.y
        if (
            Number.isInteger(x) &&
            Number.isInteger(y) &&
            y >= 0 &&
            y < height &&
            Array.isArray(map[y]) &&
            x >= 0 &&
            x < map[y].length
        ) {
            highlighted.add(`${x},${y}`)
        }
    }
    if (highlighted.size === 0) {
        const plain = map.map(row => row.join('')).join('\n')
        console.log(plain)
        return
    }
    let format = ''
    const styles = []
    const NORMAL = 'color: inherit;'
    const HIGHLIGHT = 'color: red;'
    let lastStyle = null
    function append(text, style) {
        if (!text) return
        if (style !== lastStyle) {
            format += '%c' + text
            styles.push(style)
            lastStyle = style
        } else {
            format += text
        }
    }
    for (let y = 0; y < height; y++) {
        const row = map[y] || []
        for (let x = 0; x < row.length; x++) {
            const ch = String(row[x])
            const style = highlighted.has(`${x},${y}`) ? HIGHLIGHT : NORMAL
            append(ch, style)
        }
        if (y < height - 1) {
            append('\n', NORMAL)
        }
    }
    console.log(format, ...styles)
}
