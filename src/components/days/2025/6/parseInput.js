export function parseInput(input) {
    //first case assumes the complete number is in a row, separated with whitespaces from another number for another column
    const rows = input.split('\n').map(row => row.split(' ').filter(el => el !== ''))
    // [
    //     [0,1]
    //     [2,3]
    // ]
    //     |
    //     v
    // [
    //     [0,1]
    //      | |
    //      v v
    //     [2,3]
    // ]
    //     |
    //     v
    // [
    //     [0,2]
    //     [1,3]
    // ]
    // we turn rows into columns
    //now we have stuff like ["123", "45", "6", "*"]
    const transposed = rows[0].map((_, i) => rows.map(row => row[i]))
    //[ { numbers: ["123", "45", "6"], operator: "*" } ]
    const operations = transposed.map(operation => ({ numbers: operation.slice(0, operation.length - 1), operator: operation[operation.length - 1] }))
    //we want to make the same structure for the "cephalopod math" operations as for our regular operations
    const cephalopodOperations = makeOperationsCephalofied(input)
    return [operations, cephalopodOperations];
}

function makeOperationsCephalofied(input) {
    //this time we're not removing spaces, we need them for correct column order
    const rows = input.split('\n').map(row => row.split(''))
    //transposition is exactly the same as previously (except this time we still have spaces)
    const transposed = rows[0].map((_, i) => rows.map(row => row[i]))
    //now we have stuff like:
    //[
    //  ["1", " ", " ", "*"]
    //  ["2", "4", " ", " "]
    //  ["3", "5", "6", " "]
    //  [" ", " ", " ", " "]
    //  ...
    //]
    //now it's safe to get rid of " "
    //we want to transform multiple subsequent rows starting with operator on the last position into our operator structure from part 1
    //to do that we need to reduce the transposed rows array and return a new one in which multiple rows are accounted for every operation
    const operations = transposed.map(row => row.filter(el => el !== ' ')).reduce((opArr, row) => {
        //after removing all " " the 'gap' column is empty and can be skipped, we use operator presence as indicator for new object instead
        if (row.length === 0) return opArr
        //if we do find an operator, then that means we want to create a new operation object and add it to the operations array
        if (["*", "+"].includes(row[row.length - 1])) {
            const operation = { numbers: [row.slice(0, row.length - 1).join('')], operator: row[row.length - 1] }
            opArr.push(operation)
        } else {
            //if it's neither an empty array nor operator row, it's another number for the numbers field
            opArr[opArr.length - 1].numbers.push(row.join(''))
        }
        return opArr
    }, [])
    return operations
}