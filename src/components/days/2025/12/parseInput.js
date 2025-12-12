export function parseInput(input) {
    const sections = input.split('\n\n')
    const treesRaw = sections.pop().split('\n')
    const shapes = sections.map(
        section => section.split(':\n')).reduce(
            (obj, [index, shape]) => {
                obj[index] = {
                    variants: allUniqueVariants(shape.split('\n').map(
                        row => row.replaceAll('.', ' ').split('')
                    )).map(v => compileVariant(v)), size: (shape.match(/#/g) || []).length
                };
                return obj
            }, {})
    const trees = treesRaw.map(tree => {
        const [dimensions, presentsRaw] = tree.split(': ')
        const [x, y] = dimensions.split('x').map(Number)
        const size = x * y
        const presents = presentsRaw.split(' ').map(Number)
        let spacesLeft = size
        //we calculate if there are enough spaces to fit all presents
        for (let [index, count] of presents.entries()) spacesLeft -= shapes[index].size * count
        let map = []
        //if there is not then why bother
        if (spacesLeft >= 0)
            map = Array.from({ length: y }, () => Array(x).fill(' '))
        return { x, y, presents, size, spacesLeft, map }
    })
    return [shapes, trees];
}

//in squares (and all shapes here are 3x3) there are 8 symmetries 
function allUniqueVariants(shape) {
    const n = shape.length
    // # . .    . # #
    // # # . => . # .
    // . . #    # . .
    const rotate90 = (g) => {
        const out = Array.from({ length: n }, () => Array(n))
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out[c][n - 1 - r] = g[r][c]
        return out
    }
    // # . .    . . #
    // # # . => . # #
    // . . #    # . .
    const flipVertical = (g) => g.map(row => row.slice().reverse())
    const keyOf = (g) => g.map(row => row.join("")).join("\n")
    const candidates = []
    let g = shape
    //4 rotations of original
    for (let i = 0; i < 4; i++) {
        candidates.push(g)
        g = rotate90(g)
    }
    //4 rotations of a mirrored version
    g = flipVertical(shape)
    for (let i = 0; i < 4; i++) {
        candidates.push(g)
        g = rotate90(g)
    }

    const seen = new Set();
    const out = [];
    for (const c of candidates) {
        //turn it to string so it can be compared
        const k = keyOf(c)
        if (seen.has(k)) continue
        seen.add(k)
        out.push(c.map(row => [...row]))
    }
    return out;
}

//we remove all empty spaces, carry only the coords and fit them in 1d array
//that way we can get both coords with one iteration without any destructurization
//or other time consuming operations
function compileVariant(grid) {
    const h = grid.length
    const w = h ? grid[0].length : 0
    // coords: [dy0, dx0, dy1, dx1, ...]
    const coords = []
    for (let dy = 0; dy < h; dy++) {
        const row = grid[dy]
        for (let dx = 0; dx < w; dx++) {
            if (row[dx] !== ' ') coords.push(dy, dx)
        }
    }
    return { grid, w, h, coords }
}