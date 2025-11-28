self.onmessage = async function (event) {
    const { type, year, day, inputs, part, example, differentExamples, peek } = event.data;

    try {
        const targetYear = year ?? 2024;
        const solverModule = await import(`../components/days/${targetYear}/${day}/solve.js`);
        const { solvePart1, solvePart2 } = solverModule;

        if (type === "solvePart1") {
            self.postMessage({ type, partialResult: solvePart1(...inputs), peek });
        } else if (type === "solvePart2") {
            self.postMessage({ type, partialResult: solvePart2(...inputs), peek });
        } else if (type === "examplePart1") {
            const example1 = differentExamples ? example[0] : example;
            self.postMessage({ type, partialResult: example ? solvePart1(...example1) : null });
        } else if (type === "examplePart2") {
            const example2 = differentExamples ? example[1] : example;
            self.postMessage({ type, partialResult: example ? solvePart2(...example2) : null });
        } else {
            self.postMessage({ error: "Invalid task type." });
        }
    } catch (error) {
        console.error("Error in worker:", error);
        self.postMessage({
            type: "error",
            error: `Failed to process task: ${error.message}`,
        });
    }
};
