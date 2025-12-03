self.onmessage = async function (event) {
    const { type, year, day, inputs, part, example, differentExamples, peek } = event.data;

    try {
        const targetYear = year ?? 2024;
        const solverModule = await import(`../components/days/${targetYear}/${day}/solve.js`);
        const { solvePart1, solvePart2 } = solverModule;

        const withDuration = (fn, args) => {
            const start = performance.now();
            const result = fn(...args);
            const duration = Number((performance.now() - start).toFixed(4));
            return { result, duration };
        };

        if (type === "solvePart1") {
            const { result, duration } = withDuration(solvePart1, inputs);
            self.postMessage({ type, partialResult: result, peek, durationMs: duration });
        } else if (type === "solvePart2") {
            const { result, duration } = withDuration(solvePart2, inputs);
            self.postMessage({ type, partialResult: result, peek, durationMs: duration });
        } else if (type === "examplePart1") {
            const example1 = differentExamples ? example[0] : example;
            if (example) {
                const { result, duration } = withDuration(solvePart1, example1);
                self.postMessage({ type, partialResult: result, durationMs: duration });
            } else {
                self.postMessage({ type, partialResult: null, durationMs: null });
            }
        } else if (type === "examplePart2") {
            const example2 = differentExamples ? example[1] : example;
            if (example) {
                const { result, duration } = withDuration(solvePart2, example2);
                self.postMessage({ type, partialResult: result, durationMs: duration });
            } else {
                self.postMessage({ type, partialResult: null, durationMs: null });
            }
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
