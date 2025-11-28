export function solvePart1(...machines) { 
    let cost = 0
    for(let machine of machines) {
        const {A, B, prize} = machine
        const {x: ax, y: ay} = A
        const {x: bx, y: by} = B
        const {x: px, y: py} = prize
        //so we have a pair of equations with 2 unknowns a and b: px = ax*a + bx*b and py = ay*a + by*b
        //px*by = ax*a*by + bx*b*by, py*bx = ay*a*bx + by*b*bx
        //px*by - py*bx = ax*a*by - ay*a*bx + by*b*bx - by*b*bx = ax*a*by - ay*a*bx
        //px*by - py*bx = a*(ax*by - ay*bx)
        //a = (px*by - py*bx)/(ax*by - ay*bx) - which are known
        //substituting a in px = ax*a + bx*b and py = ay*a + by*b allows us to solve for b
        //b = (px*ay - py*ax)/(ay*bx - ax*by)
        //that means that ay*bx !== ax*by, and from the puzzle we also know that a >= 100 and b >= 100
        //we also have to discard non-integer solutions
        if(ay*bx !== ax*by) {
            let [a, b] = [(px*by - py*bx)/(ax*by - ay*bx), (px*ay - py*ax)/(ay*bx - ax*by)]
            if(a <= 100 && b <= 100 && Number.isInteger(a) && Number.isInteger(b)
            ) {
                cost += a*3 + b
            }
        }
    }
    return cost
}

export function solvePart2(...machines) { 
    let cost = 0
    for(let machine of machines) {
        const {A, B, prize} = machine
        const {x: ax, y: ay} = A
        const {x: bx, y: by} = B
        let {x: px, y: py} = prize
        px += 10000000000000
        py += 10000000000000
        if(ay*bx !== ax*by) {
            let [a, b] = [(px*by - py*bx)/(ax*by - ay*bx), (px*ay - py*ax)/(ay*bx - ax*by)]
            if(Number.isInteger(a) && Number.isInteger(b)) {
                cost += a*3 + b
            }
        }
    }
    return cost
}
