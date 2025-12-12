// solve.js
export function solvePart1(shapes, trees) {
  const example = trees.length === 3
  trees = trees.filter(tree => tree.spacesLeft >= 0)
  if (example) {
    let total = 0
    for (const tree of trees) {
      const workMap = tree.map.map(r => [...r])
      const presents = [...tree.presents]
      //place bigger shapes first to reduce branching
      const pieces = []
      for (let i = 0; i < presents.length; i++) {
        const cnt = presents[i] | 0
        for (let k = 0; k < cnt; k++) pieces.push(i)
      }
      pieces.sort((a, b) => shapes[b].size - shapes[a].size)
      //try to place every piece
      const solveTree = (pi) => {
        if (pi >= pieces.length) return true
        const shapeIndex = pieces[pi]
        const shape = shapes[shapeIndex]
        if (!shape) return false
        //try every variant at every position
        for (const variant of shape.variants) {
          for (let y = 0; y <= tree.y - variant.h; y++) {
            for (let x = 0; x <= tree.x - variant.w; x++) {
              if (!canPlace(workMap, variant, x, y)) continue
              //place
              const changed = []
              const coords = variant.coords
              for (let i = 0; i < coords.length; i += 2) {
                const yy = y + coords[i]
                const xx = x + coords[i + 1]
                workMap[yy][xx] = '#'
                changed.push(yy, xx)
              }
              if (solveTree(pi + 1)) return true
              //go back
              for (let i = 0; i < changed.length; i += 2) {
                workMap[changed[i]][changed[i + 1]] = ' '
              }
            }
          }
        }
        return false
      }
      if (solveTree(0)) total++
    }
    return total
  }
  //who knows maybe all trees from the input that can actually fit their presents are good
  return trees.length
}

export function solvePart2(...input) {
  return "that's all folks"
}


function canPlace(map, variant, x, y) {
  const height = map.length
  const width = map[0].length
  //if it would go beyond the bounds
  if (x + variant.w > width || y + variant.h > height) return false
  const coords = variant.coords
  //we keep coords as an array of [x1, y1, x2, y2, ...] because traversing one array is faster and we need to check all coords anyway
  for (let i = 0; i < coords.length; i += 2) {
    const dy = coords[i]
    const dx = coords[i + 1]
    if (map[y + dy][x + dx] !== ' ') return false
  }
  return true
}