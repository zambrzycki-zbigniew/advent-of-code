self.onmessage = async function (event) {
    const { type, year, day, inputs } = event.data;

    try {
        const targetYear = year ?? 2024;
        const solverModule = await import(`../components/days/${targetYear}/${day}/animation.js`);
        const { solvePart1, solvePart2 } = solverModule;

        /**
         * Streams generator-produced animation actions back to the main thread.
         * Adds a short delay between batches to keep playback smooth.
         * @param {Generator} generator animation generator yielding action arrays
         * @param {string} messageType message identifier used when posting the final result
         */
        async function processGenerator(generator, messageType) {
            for (const actions of generator) {
                self.postMessage({
                    type: 'animationActions',
                    actions,
                });

                await new Promise((resolve) => setTimeout(resolve, 50));
            }

            const finalResult = generator.return().value || null;
            self.postMessage({
                type: messageType,
                finalResult,
            });
        }

        if (type === 'solvePart1') {
            const generator = solvePart1(...inputs);
            await processGenerator(generator, 'solvePart1');
        } else if (type === 'solvePart2') {
            const generator = solvePart2(...inputs);
            await processGenerator(generator, 'solvePart2');
        } else {
            self.postMessage({ error: 'Invalid task type.' });
        }
    } catch (error) {
        console.error('Error in worker:', error);
        self.postMessage({
            type: 'error',
            error: `Failed to process task: ${error.message}`,
        });
    }
};
