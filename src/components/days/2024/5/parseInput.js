export function parseInput(input) {
    const [rulesRaw, updatesRaw] = input.replaceAll('\r', '').split('\n\n')
    const rules = rulesRaw.split('\n').map(r => r.split('|')).reduce((dict, [before, after]) => {
        before = parseInt(before)
        after = parseInt(after)
        if(!dict[parseInt(before)]) dict[before] = {before: {}, after: {}}
        if(!dict[after]) dict[after] = {before: {}, after: {}}
        dict[before].after[after] = true
        dict[after].before[before] = true
        return dict
    }, {})
    const updates = updatesRaw ? updatesRaw.split('\n').map(updateRow => {
        const pages = updateRow.split(',')
        return pages
    }) : []
    return [rules, updates]
}