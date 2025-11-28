export function solvePart1(...reports) {
    let safeReports = 0
    for (let report of reports) {
        if (reportCheckingFunction(report)) safeReports++
    }
    return safeReports
}

export function solvePart2(...reports) {
    let safeReports = 0
    for (let report of reports) {
        if (reportCheckingFunction(report)) safeReports++
        else {
            for(let levelIndex in report) {
                let reducedReport = [...report]
                reducedReport.splice(levelIndex, 1)
                if (reportCheckingFunction(reducedReport)) {
                    safeReports++
                    break;
                }
            }
        }
    }
    return safeReports
}

function reportCheckingFunction(report) {
    return (!report.some((level, index, array) =>
        array[index + 1] &&
        (0 >= Math.abs(level - array[index + 1]) || 4 <= Math.abs(level - array[index + 1]))
    ) &&
    (
        report.every((level, index, array) => !array[index + 1] ||
            level > array[index + 1]
        ) ||
        report.every((level, index, array) => !array[index + 1] ||
            level < array[index + 1]
        )
    ))
}