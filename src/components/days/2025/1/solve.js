export function solvePart1(...input) {
    let dial = 50;
    let zeros = 0
    for (let { direction, count } of input) {
        const rest = count % 100;
        if (direction === 'R') dial += rest;
        else dial -= rest;        
        if (dial > 99) dial -= 100;
        if (dial < 0) dial += 100;
        if(dial === 0) zeros++;
    }
    return zeros;
}

export function solvePart2(...input) {
    let dial = 50;
    let zeros = 0
    for (let { direction, count } of input) {
        let prev = dial
        const rest = count % 100;
        //each 100 crosses 0 exactly once
        zeros += Math.floor(count/100)
        if (direction === 'R') dial += rest;
        else dial -= rest;
        if (dial > 99) { 
            //if passing-over put us on 0, don't count it, let final if do that
            if(dial !== 0) zeros++;
            dial -= 100;
        }
        if (dial < 0) {
            //if it was at 0 and was lowered, then the first turn shouldn't count, we count only "clicks" turning the dial TO 0
            if(prev !== 0) zeros++;
            dial += 100;
        }
        if(dial === 0) zeros++
    }
    return zeros;
}
