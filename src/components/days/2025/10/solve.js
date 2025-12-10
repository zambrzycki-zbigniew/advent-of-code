// import { MinPriorityQueue } from "./MinPriorityQueue.js";

export function solvePart1(...input) {
    const example = input.length === 3
    let sum = 0
    for (const { indicators, buttons } of input) {
        const start = Array(indicators.length).fill(false)
        const sstart = start.toString()
        const graph = makeGraph(start, buttons)
        const endsi = translate.get(indicators.toString())
        const distances = new Map()
        const previous = new Map()
        for (const node of graph.keys()) {
            distances.set(node, Infinity)
            previous.set(node, null)
        }
        const startsi = translate.get(sstart)
        const startNode = startsi
        distances.set(startNode, 0)
        const queue = [startNode]
        let head = 0
        while (head < queue.length) {
            const current = queue[head]
            head++
            const currentDist = distances.get(current)
            const neighbours = graph.get(current) || {}
            for (const neighbour of Object.keys(neighbours)) {
                if (distances.get(neighbour) === Infinity) {
                    distances.set(neighbour, currentDist + 1)
                    previous.set(neighbour, current)
                    queue.push(neighbour)
                }
            }
        }
        sum += distances.get(endsi)
    }
    return sum;
}

const translate = new Map()

function makeGraph(start, buttons) {
    const graph = new Map()
    const queue = [start]
    while (queue.length > 0) {
        const current = queue.pop()
        const scurrent = current.toString()
        if (!translate.has(scurrent)) {
            const si = getStringIndicator(current)
            translate.set(scurrent, si)
        }
        const directions = {}
        for (let button of buttons) {
            let node = [...current]
            for (let field of button) {
                node[field] = !node[field]
            }
            const snode = node.toString()
            if (!translate.has(snode)) {
                const si = getStringIndicator(node)
                translate.set(snode, si)
            }
            const si = translate.get(snode)
            directions[si] = 1
            if (!graph.has(si)) queue.push(node)
        }
        graph.set(translate.get(scurrent), directions)
    }
    return graph
}

function getStringIndicator(boolIndicator) {
    return boolIndicator.map(b => b ? '#' : '.').join('')
}

//should've used z3-solver
export function solvePart2(...input) {
    let sum = 0
    for (const { joltage, buttons } of input) {
        const presses = solveMachine(joltage, buttons)
        sum += presses
    }
    return sum
}

export function solveMachine(joltage, buttons) {
    const { A, b } = buildSystem(joltage, buttons)
    const independent = pickIndependentRows(A, b)
    const Ared = independent.rows.map(i => A[i])
    //🍞
    const bred = independent.rows.map(i => b[i])
    const maxPress = maxPressByButton(joltage, buttons)
    const pivotCols = computePivotColumns(Ared)
    const freeCols = []
    for (let c = 0; c < buttons.length; c++) {
        if (!pivotCols.includes(c)) freeCols.push(c)
    }
    const best = solveByFreeEnumeration(Ared, bred, pivotCols, freeCols, maxPress)
    return best
}

const EPS = 1e-9

function buildSystem(joltage, buttons) {
    const nCounters = joltage.length
    const nButtons = buttons.length
    const A = Array.from({ length: nCounters }, () => new Array(nButtons).fill(0))
    for (let j = 0; j < nButtons; j++) {
        for (const c of buttons[j]) {
            A[c][j] = 1
        }
    }
    return { A, b: joltage.slice() }
}

function maxPressByButton(joltage, buttons) {
    //maximum times a button can be pressed before any counter would go negative
    const limits = new Array(buttons.length).fill(0)
    for (let j = 0; j < buttons.length; j++) {
        const touched = buttons[j]
        if (touched.length === 0) {
            limits[j] = 0
        } else {
            let min = Infinity
            for (const idx of touched) if (joltage[idx] < min) min = joltage[idx]
            limits[j] = min
        }
    }
    return limits
}

function pickIndependentRows(A, b) {
    if (A.length === 0) return { rows: [] }
    const rows = A.map((row, idx) => ({
        row: row.slice(),
        b: b[idx],
        orig: idx
    }))
    const nCols = A[0].length
    let pivotRow = 0
    const pivots = []
    for (let col = 0; col < nCols && pivotRow < rows.length; col++) {
        let sel = -1
        for (let r = pivotRow; r < rows.length; r++) {
            if (Math.abs(rows[r].row[col]) > EPS) {
                sel = r
                break
            }
        }
        if (sel === -1) continue
        if (sel !== pivotRow) {
            const tmp = rows[pivotRow]
            rows[pivotRow] = rows[sel]
            rows[sel] = tmp
        }
        const pivotVal = rows[pivotRow].row[col]
        if (Math.abs(pivotVal - 1) > EPS) {
            for (let c = col; c < nCols; c++) rows[pivotRow].row[c] /= pivotVal
            rows[pivotRow].b /= pivotVal
        }
        for (let r = pivotRow + 1; r < rows.length; r++) {
            const factor = rows[r].row[col]
            if (Math.abs(factor) < EPS) continue
            for (let c = col; c < nCols; c++) {
                rows[r].row[c] -= factor * rows[pivotRow].row[c]
            }
            rows[r].b -= factor * rows[pivotRow].b
        }
        pivots.push(rows[pivotRow].orig)
        pivotRow++
    }
    for (let r = pivotRow; r < rows.length; r++) {
        const zeroRow = rows[r].row.every(v => Math.abs(v) < EPS)
        if (zeroRow && Math.abs(rows[r].b) > EPS) return null
    }
    return { rows: pivots }
}

function invertMatrix(matrix) {
    const n = matrix.length
    const a = matrix.map(row => row.slice())
    const inv = Array.from({ length: n }, (_, i) => {
        const row = new Array(n).fill(0)
        row[i] = 1
        return row
    })
    for (let col = 0; col < n; col++) {
        let pivot = col
        let best = Math.abs(a[pivot][col])
        for (let r = col + 1; r < n; r++) {
            const val = Math.abs(a[r][col])
            if (val > best) {
                best = val
                pivot = r
            }
        }
        if (best < EPS) return null
        if (pivot !== col) {
            const tmp = a[col]; a[col] = a[pivot]; a[pivot] = tmp
            const tmpInv = inv[col]; inv[col] = inv[pivot]; inv[pivot] = tmpInv
        }
        const diag = a[col][col]
        for (let c = 0; c < n; c++) {
            a[col][c] /= diag
            inv[col][c] /= diag
        }
        for (let r = 0; r < n; r++) {
            if (r === col) continue
            const factor = a[r][col]
            if (Math.abs(factor) < EPS) continue
            for (let c = 0; c < n; c++) {
                a[r][c] -= factor * a[col][c]
                inv[r][c] -= factor * inv[col][c]
            }
        }
    }
    return inv
}

function computePivotColumns(A) {
    const rows = A.length
    const cols = rows === 0 ? 0 : A[0].length
    const mat = A.map(r => r.slice())
    let r = 0
    const pivots = []
    for (let c = 0; c < cols && r < rows; c++) {
        let sel = -1
        for (let rr = r; rr < rows; rr++) {
            if (Math.abs(mat[rr][c]) > EPS) {
                sel = rr
                break
            }
        }
        if (sel === -1) continue
        if (sel !== r) [mat[r], mat[sel]] = [mat[sel], mat[r]]
        const pivotVal = mat[r][c]
        for (let cc = c; cc < cols; cc++) mat[r][cc] /= pivotVal
        for (let rr = 0; rr < rows; rr++) {
            if (rr === r) continue
            const factor = mat[rr][c]
            if (Math.abs(factor) < EPS) continue
            for (let cc = c; cc < cols; cc++) mat[rr][cc] -= factor * mat[r][cc]
        }
        pivots.push(c)
        r++
    }
    return pivots
}

function solveByFreeEnumeration(A, b, pivotCols, freeCols, maxPress) {
    const rank = pivotCols.length
    if (rank === 0) return 0
    const B = Array.from({ length: rank }, (_, r) => pivotCols.map(c => A[r][c]))
    const Binv = invertMatrix(B)
    if (!Binv) return null
    const base = multiplyMatrixVector(Binv, b)
    const freeCount = freeCols.length
    const coeff = freeCols.map(c => {
        const col = A.map(row => row[c])
        return multiplyMatrixVector(Binv, col).map(v => -v)
    })

    const freeMax = freeCols.map(c => maxPress[c])
    let best = Infinity
    const assigned = new Array(freeCount).fill(0)
    function dfs(idx) {
        if (idx === freeCount) {
            const basicVals = new Array(rank).fill(0)
            for (let r = 0; r < rank; r++) {
                let v = base[r]
                for (let k = 0; k < freeCount; k++) v += coeff[k][r] * assigned[k]
                const maxAllowed = maxPress[pivotCols[r]]
                if (v < -EPS || v > maxAllowed + EPS) return
                if (Math.abs(v - Math.round(v)) > 1e-7) return
                basicVals[r] = Math.round(v)
            }
            let cost = 0
            for (const v of assigned) cost += v
            for (const v of basicVals) cost += v
            if (cost < best) best = cost
            return
        }
        let lo = 0
        let hi = freeMax[idx]
        for (let r = 0; r < rank; r++) {
            let baseVal = base[r]
            for (let k = 0; k < idx; k++) baseVal += coeff[k][r] * assigned[k]

            let lowFuture = 0
            let highFuture = 0
            for (let k = idx + 1; k < freeCount; k++) {
                const c = coeff[k][r]
                if (c < 0) lowFuture += c * freeMax[k]
                else highFuture += c * freeMax[k]
            }
            const ccur = coeff[idx][r]
            const minNeeded = -baseVal - highFuture
            const maxAllowed = maxPress[pivotCols[r]] - baseVal - lowFuture
            if (Math.abs(ccur) < EPS) {
                if (minNeeded > EPS || maxAllowed < -EPS) return
                continue
            }
            if (ccur > 0) {
                lo = Math.max(lo, Math.ceil(minNeeded / ccur - EPS))
                hi = Math.min(hi, Math.floor(maxAllowed / ccur + EPS))
            } else {
                lo = Math.max(lo, Math.ceil(maxAllowed / ccur - EPS))
                hi = Math.min(hi, Math.floor(minNeeded / ccur + EPS))
            }
            if (lo > hi) return
        }
        for (let val = lo; val <= hi; val++) {
            assigned[idx] = val
            dfs(idx + 1)
        }
    }
    dfs(0)
    return Number.isFinite(best) ? best : null
}

function multiplyMatrixVector(mat, vec) {
    return mat.map(row => {
        let v = 0
        for (let i = 0; i < row.length; i++) v += row[i] * vec[i]
        return v
    })
}
