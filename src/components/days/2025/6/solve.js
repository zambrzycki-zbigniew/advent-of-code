export function solvePart1(operations, _) {
  return calculate(operations);
}

export function solvePart2(_, operations) {
  return calculate(operations);
}


function calculate(operations) {
    let sum = 0
    //we add all numbers in operation with + operator
    for(const { numbers } of operations.filter(({operator}) => operator === '+')) sum += numbers.reduce((result, number) => result + Number(number), 0)
    //we multiply all numbers in operation with * operator, starting with 1
    for(const { numbers } of operations.filter(({operator}) => operator === '*')) sum += numbers.reduce((result, number) => result * Number(number), 1)
    return sum
}