export function solvePart1(start, splitters, height) {
    //we keep the set of beam coordinates for one row at a time
    //set makes sure that there are no duplicates, so if 2 beams merge they come out as 1 beam
    let beams = new Set([`${start.x}.${start.y + 1}`])
    let splits = 0
    //we start with 1 because we're optimized like that
    let reached = 1
    while (reached < height) {
        //we will use the beam coordinates from previous iteration
        let oldBeams = beams
        beams = new Set()
        for (let coord of oldBeams) {
            const [x, y] = coord.split('.').map(Number)
            //if under our beam is a splitter, then we add 2 new beams on either side of the splitter, otherwise we continue to travel down
            const xs = splitters.has(`${x}.${y + 1}`) ? [x - 1, x + 1] : [x]
            for (const nx of xs) beams.add(`${nx}.${y + 1}`)
            //we add either 0 or 1
            splits += xs.length - 1
        }
        reached++
    }
    return splits;
}

export function solvePart2(start, splitters, height, rows) {
    const example = height === 16
    //beams is an array of all coords which beams reached, per row
    //we don't NEED to keep all beams, but we do it so we can print them
    //for each beam we keep a number of beams from all timelines that also got to this coord
    //if a beam gets to coord then it means it will travel exactly the same way as other beams that got there
    const beams = [{}, { [`${start.x}.${start.y + 1}`]: 1 }]
    let reached = 1
    while (reached < height) {
        beams.push({})
        for (let [coord, count] of Object.entries(beams[reached])) {
            const [x, y] = coord.split('.').map(Number)
            const xs = splitters.has(`${x}.${y + 1}`) ? [x - 1, x + 1] : [x]
            for (const nx of xs) {
                const key = `${nx}.${y + 1}`
                //if it's a new beam, then we carry on the number of possible beams, but if we already have this beam in this
                //row saved, then we add the number of possible beams together
                beams[y + 1][key] = beams[y + 1][key] ? beams[y + 1][key] + count : count
            }
        }
        reached++
    }
    //printing beams in console
    if (example) printBeams(rows, beams)
    const counts = Object.values(beams[reached])
    //we take the last row and add the counts of all possible beams together
    const sum = counts.reduce((sum, count) => sum + count, 0)
    if (example) console.log(`${counts.join(' + ')} = ${sum}`)
    return sum

}

//this one is more space and (very slightly) time efficient, but can't print beams in console
export function solvePart2Efficient(start, splitters, height) {
    let beams = { [`${start.x}.${start.y + 1}`]: 1 }
    let reached = 1
    while (reached < height) {
        let oldBeams = beams
        beams = {}
        for (let [coord, count] of Object.entries(oldBeams)) {
            const [x, y] = coord.split('.').map(Number)
            const xs = splitters.has(`${x}.${y + 1}`) ? [x - 1, x + 1] : [x]
            for (const nx of xs) {
                const key = `${nx}.${y + 1}`
                beams[key] = beams[key] ? beams[key] + count : count
            }
        }
        reached++
    }
    return Object.values(beams).reduce((sum, count) => sum + count, 0)

}

//prints beam counts in console
function printBeams(rows, beams) {
    const BLUE_RGB = [0, 120, 255]
    const YELLOW_RGB = [255, 215, 0]
    const ORANGE_RGB = [255, 140, 0]
    const RED_RGB = [220, 20, 60]
    let maxWidth = 1
    let maxCount = -Infinity
    let minCount = Infinity
    //we get dimensions for the log
    for (let row of beams) {
        for (const count of Object.values(row)) {
            const digits = String(count).length
            if (digits > maxWidth) maxWidth = digits
            if (count > maxCount) maxCount = count
            if (count < minCount) minCount = count
        }
    }
    //color interpolation, blue for the lowest, red for the highest
    const lerpColor = (val) => {
        const normalized = (val - minCount) / Math.max(1, maxCount - minCount)
        const gradientStops = [BLUE_RGB, YELLOW_RGB, ORANGE_RGB, RED_RGB]
        const segmentCount = gradientStops.length - 1
        const scaled = Math.max(0, Math.min(1, normalized)) * segmentCount
        const segmentIndex = Math.min(segmentCount - 1, Math.floor(scaled))
        const segmentProgress = scaled - segmentIndex
        const fromColor = gradientStops[segmentIndex]
        const toColor = gradientStops[segmentIndex + 1]
        const mixChannel = (start, end) => Math.round(start + (end - start) * segmentProgress)
        const [r, g, b] = [mixChannel(fromColor[0], toColor[0]), mixChannel(fromColor[1], toColor[1]), mixChannel(fromColor[2], toColor[2])]
        return `color: rgb(${r}, ${g}, ${b}); font-weight: bold`
    }
    for (let y in rows) {
        let lineText = ""
        let beamRow = beams[Number(y)]
        const styles = []
        for (let x in rows[y]) {
            const key = `${x}.${y}`
            const beamCount = beamRow[key]
            const width = maxWidth
            //if there's a beam there
            if (beamCount) {
                //add necessary spaces before until it reaches the max width
                const countStr = String(beamCount).padStart(width)
                lineText += `%c${countStr}%c`
                //we interpolate the color of each count based on how high it is
                styles.push(lerpColor(beamCount), "")
            } else {
                //remove "."
                const char = rows[y][x] === "." ? " " : rows[y][x]
                //add spaces
                lineText += char.padStart(width)
            }
        }
        //apply styles and print line by line
        console.log(lineText, ...styles)
    }
}
