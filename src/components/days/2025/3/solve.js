export function solvePart1(...input) {
    let sum = 0
    for (let row of input) {
        let nums = row.split('').map(Number)
        //just sort, get 2 biggest numbers and see if they're in order
        let sorted = [...nums].sort((a, b) => b - a)
        let i1 = nums.indexOf(sorted.shift())
        let i2 = nums.indexOf(sorted.shift())
        //if the greatest number is at the very end of the list, then just take them,
        //if not find the greatest number after and make it the second number
        if (i1 < nums.length - 1) {
            sorted = nums.slice(i1 + 1).sort((a, b) => b - a)
            i2 = nums.indexOf(sorted.shift(), i1)
        }
        if (input.length === 4) highlight(nums, i1, i2)
        //depending on the case, if the greatest number is last or not
        if (i1 < i2) sum += Number(`${nums[i1]}${nums[i2]}`)
        else sum += Number(`${nums[i2]}${nums[i1]}`)
    }
    return sum
}

export function solvePart2(...input) {
    let sum = 0
    const maxD = 12
    for (let row of input) {
        //need objects to track order of numbers
        let nums = row.split('').map(e => ({ v: Number(e) }))
        //just for display in console
        const rawnums = row.split('').map(Number)
        const maxNums = []
        const indices = []
        let maxi = 0
        //we're looking for 12 digits
        while (maxNums.length < maxD) {
            //remaining number of digits to find
            const remaining = maxD - maxNums.length
            //in first iteration we want to stop at the 12th number from the end
            //in second, after we got one, we can stop searching one number later
            //so we want to stop at index d
            let d = nums.length - remaining
            let max = nums[maxi]
            //we start at first number after the last greatest number found
            let i = maxi + 1
            while (i <= d) {
                //find the max for this iteration
                if (nums[i].v > max.v) {
                    max = nums[i]
                    maxi = i
                }
                i++
            }
            //push all greatest numbers in order
            maxNums.push(max)
            //just for console.log highlight
            indices.push(maxi)
            //start preparing next number to be assumed max in next iteration
            maxi = maxi + 1
        }
        const result = maxNums.map(e => e.v).join('')
        if(input.length === 4) highlight2(rawnums, indices)
        sum += Number(result)
    }
    return sum
}

function highlight(nums, i1, i2) {
    const first = Math.min(i1, i2)
    const second = Math.max(i1, i2)
    const part0 = nums.slice(0, first).join('')
    const marker1 = String(nums[first])
    const middle = nums.slice(first + 1, second).join('')
    const marker2 = String(nums[second])
    const part2 = nums.slice(second + 1).join('')
    console.log(
        '%c' + part0 +
        '%c' + marker1 +
        '%c' + middle +
        '%c' + marker2 +
        '%c' + part2,
        'color: inherit;',
        'color: orange;',
        'color: inherit;',
        'color: orange;',
        'color: inherit;'
    )
}

function highlight2(nums, indices) {
    const len = nums.length
    const highlightIndices = [...new Set(indices)]
        .filter(i => Number.isInteger(i) && i >= 0 && i < len)
        .sort((a, b) => a - b)
    if (highlightIndices.length === 0) {
        console.log(nums.join(''))
        return
    }
    let format = ''
    const styles = []
    let currentPos = 0
    for (let index of highlightIndices) {
        if (index > currentPos) {
            const normalSegment = nums.slice(currentPos, index).join('')
            if (normalSegment.length > 0) {
                format += '%c' + normalSegment
                styles.push('color: inherit;')
            }
        }
        const highlighted = String(nums[index])
        format += '%c' + highlighted
        styles.push('color: lime;')
        currentPos = index + 1
    }
    if (currentPos < len) {
        const tail = nums.slice(currentPos).join('')
        if (tail.length > 0) {
            format += '%c' + tail
            styles.push('color: inherit;')
        }
    }
    console.log(format, ...styles)
}
