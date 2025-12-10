export function parseInput(input) {
    const rows = input.split('\n').map(row => row.split(' ')).map(row => {
        const joltageRaw = row.pop()
        const [targetIndicatorLightsRaw, ...buttonsRaw] = row
        const joltage = joltageRaw.replace(/[{}]/g, "").split(',').map(Number)
        const indicators = targetIndicatorLightsRaw.replace(/[[\]]/g, "").split('').map(ind => ind === '#')
        const buttons = buttonsRaw.map(button => button.replace(/[()]/g, "").split(',').map(Number))
        return {indicators, buttons, joltage}
    })
    return rows;
}
