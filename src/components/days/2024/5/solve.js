export function solvePart1(rules, updates) {
    let middles = 0
    for(let pages of updates) {
        let correct = true
        for(let pageIndex in pages.slice(0, -1)) {
            let page = pages[pageIndex]
            let laterPages = pages.slice(parseInt(pageIndex) + 1)
            if(laterPages.some(p => p in rules[page].before)) {
                correct = false
                break;
            }
        }
        if(correct) middles += parseInt(pages[Math.floor(pages.length/2)])
    }
    return middles
}

export function solvePart2(rules, updates) {
    let middles = 0
    for(let pages of updates) {
        let incorrect = false
        for(let pageIndex in pages.slice(0, -1)) {
            let page = pages[pageIndex]
            let laterPages = pages.slice(parseInt(pageIndex) + 1)
            if(laterPages.some(p => p in rules[page].before)) {
                incorrect = true
                break;
            }
        }
        if(incorrect) {
            pages.sort((a, b) => b in rules[a].after ? -1 : 1)
            middles += parseInt(pages[Math.floor(pages.length/2)])
        }
    }
    return middles
}