export function solvePart1(mapX, mapY, robots) {
    let q = [0, 0, 0, 0]
    const map = Array.from({ length: mapY }, () =>
        Array.from({ length: mapX }, () => 0)
    );
    let [midX, midY] = [Math.floor(mapX / 2), Math.floor(mapY / 2)]
    for (let robot of robots) {
        let { x, y } = robot.p
        let { x: dx, y: dy } = robot.v
        x = (x + dx * 100) % mapX
        y = (y + dy * 100) % mapY
        if (x < 0) x = mapX + x
        if (y < 0) y = mapY + y
        if (x < midX && y < midY) q[0]++
        else if (x > midX && y < midY) q[1]++
        else if (x < midX && y > midY) q[2]++
        else if (x > midX && y > midY) q[3]++
        map[y][x]++
    }
    return q[0] * q[1] * q[2] * q[3];
}

export function solvePart2(mapX, mapY, robots) {
    let q = [0, 0, 0, 0]
    let potentialTree = []
    for (let seconds = 0; seconds < 10000; seconds++) {
        const map = Array.from({ length: mapY }, () =>
            Array.from({ length: mapX }, () => 0)
        );
        for (let robot of robots) {
            let { x, y } = robot.p
            let { x: dx, y: dy } = robot.v
            x = (x + dx * seconds) % mapX
            y = (y + dy * seconds) % mapY
            if (x < 0) x = mapX + x
            if (y < 0) y = mapY + y
            map[y][x]++
        }
        if (robots.some(robot => {
            let { x, y } = robot.p;
            //i've made the required straight line longer until only the fucking tree remained
            return map[y][x] > 0 && map[y][x + 1] > 0 && map[y][x + 2] > 0 && map[y][x + 3] > 0 && map[y][x + 4] > 0  && map[y][x + 5] > 0  && map[y][x + 6] > 0 
        })) {
            potentialTree.push(seconds)
            console.log(seconds);
            console.log(map.reduce((m, row) => m + row.reduce((r, c) => c > 0 ? r + c : r + '.', '') + '\n', ''));
        }
    }
    if(potentialTree.length === 0) return 'there are no fucking trees'
    return `there is a fucking tree at ${potentialTree.length > 1 ? potentialTree.slice(0, -1).join(', ') + ' or ' + potentialTree.slice(potentialTree.length-1)[0] : potentialTree[0]}`
}
