const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DEFAULT_YEAR = 2024;

/** Enable CORS so the Vite frontend can call the helper endpoints locally. */
app.use(cors());

/** Parse JSON and plain text bodies sent from the UI helper tools. */
app.use(bodyParser.text());
app.use(bodyParser.json());

/**
 * PUT /inputs/:filename
 * Writes the provided body into public/inputs for quick local iteration.
 */
app.put('/inputs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'inputs', filename);

  // Create the directory if it does not exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Persist the uploaded file
  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
      console.error(`Error saving file ${filename}:`, err);
      return res.status(500).send('Error saving file');
    }
    res.send('File saved successfully');
  });
});

/**
 * PUT /examples
 * Merges incoming example outputs into public/examples.json.
 * Accepts both legacy { "1": [...] } and multi-year { "2024": { "1": [...] } } shapes.
 */
app.put('/examples', (req, res) => {
  const examplesFilePath = path.join(__dirname, 'public', 'examples.json');
  const newExamples = req.body;

  // Read the existing file
  fs.readFile(examplesFilePath, 'utf8', (err, data) => {
    let examples = {};

    if (!err && data) {
      try {
        examples = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing existing examples.json:', parseErr);
      }
    }

    const isLegacyShape =
      newExamples && !Array.isArray(newExamples) && Object.values(newExamples).every((v) => Array.isArray(v));

    const mergeTarget = isLegacyShape ? { [DEFAULT_YEAR]: newExamples } : newExamples;

    Object.entries(mergeTarget || {}).forEach(([year, days]) => {
      if (!examples[year]) examples[year] = {};
      Object.keys(days || {}).forEach((day) => {
        examples[year][day] = days[day];
      });
    });

    // Save the updated data
    fs.writeFile(examplesFilePath, JSON.stringify(examples, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving examples.json:', writeErr);
        return res.status(500).send('Error saving examples.json');
      }
      res.send('Examples.json updated successfully');
    });
  });
});

/**
 * POST /create-day/:year/:day
 * Ensures parseInput.js and solve.js stubs exist for a given year/day.
 */
function createDayFiles(year, day, res) {
  const basePath = path.join(__dirname, 'src', 'components', 'days', year, day);

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  const files = {
    'parseInput.js': `export function parseInput(input) {    
    return [input];
}
`,
    'solve.js': `export function solvePart1(...input) { 
    return null;
}

export function solvePart2(...input) { 
    console.log(input);
    return null;
}
`,
  };

  Object.entries(files).forEach(([filename, content]) => {
    const filePath = path.join(basePath, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  });

  res.send(`Files created for ${year} day ${day}`);
}

app.post('/create-day/:year/:day', (req, res) => {
  const { year, day } = req.params;
  createDayFiles(year, day, res);
});

app.post('/create-day/:day', (req, res) => {
  const day = req.params.day;
  createDayFiles(DEFAULT_YEAR, day, res);
});

// Start the helper server
app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
