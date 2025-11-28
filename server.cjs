const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DEFAULT_YEAR = 2024;
const sseClients = [];

/** Enable CORS so the Vite frontend can call the helper endpoints locally. */
app.use(cors());

/** Parse JSON and plain text bodies sent from the UI helper tools. */
app.use(bodyParser.text());
app.use(bodyParser.json());

/**
 * PUT /inputs/{*path} (supports nested paths like /year/day.txt)
 * Writes the provided body into public/inputs for quick local iteration.
 */
app.put('/inputs/{*path}', (req, res) => {
  const pathParam = req.params.path;
  const filename = Array.isArray(pathParam) ? pathParam.join('/') : pathParam;
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
 * DELETE /inputs/{*path} (supports nested paths)
 * Removes a specific input/example file if present.
 */
app.delete('/inputs/{*path}', (req, res) => {
  const pathParam = req.params.path;
  const filename = Array.isArray(pathParam) ? pathParam.join('/') : pathParam;
  const filePath = path.join(__dirname, 'public', 'inputs', filename);
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.send('File deleted');
  } catch (err) {
    console.error(`Error deleting file ${filename}:`, err);
    res.status(500).send('Error deleting file');
  }
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
 * Ensures parseInput.js and solve.js stubs exist for a given year/day.
 */
function createDayFiles(year, day) {
  const yearStr = year.toString();
  const dayStr = day.toString();
  const basePath = path.join(__dirname, 'src', 'components', 'days', yearStr, dayStr);

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
}

/**
 * POST /create-year
 * Creates stub files and input folders for all days in a year.
 * Body: { year: number, dayCount: number }
 */
app.post('/create-year', (req, res) => {
  const { year, dayCount } = req.body || {};
  if (!year || !dayCount) return res.status(400).send('year and dayCount are required');

  const yearStr = year.toString();
  const count = parseInt(dayCount, 10);

  const inputsDir = path.join(__dirname, 'public', 'inputs', yearStr);
  if (!fs.existsSync(inputsDir)) fs.mkdirSync(inputsDir, { recursive: true });

  for (let day = 1; day <= count; day += 1) {
    createDayFiles(yearStr, day);
  }
  res.send(`Created ${count} days for year ${yearStr}`);
});

app.post('/create-day/:year/:day', (req, res) => {
  const { year, day } = req.params;
  createDayFiles(year.toString(), parseInt(day, 10));
  res.send(`Files created for ${year} day ${day}`);
});

app.post('/create-day/:day', (req, res) => {
  const day = req.params.day;
  createDayFiles(DEFAULT_YEAR.toString(), parseInt(day, 10));
  res.send(`Files created for ${DEFAULT_YEAR} day ${day}`);
});

// SSE endpoint to notify dev clients about input file changes
app.get('/inputs-events', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).end();
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });
  res.write('\n');
  sseClients.push(res);
  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx >= 0) sseClients.splice(idx, 1);
  });
});

/**
 * PUT /years
 * Merge year day-count configuration into public/years.json.
 */
app.put('/years', (req, res) => {
  const yearsPath = path.join(__dirname, 'public', 'years.json');
  const incoming = req.body || {};

  fs.readFile(yearsPath, 'utf8', (err, data) => {
    let years = {};
    if (!err && data) {
      try {
        years = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing existing years.json:', parseErr);
      }
    }

    Object.entries(incoming).forEach(([year, dayCount]) => {
      years[year] = dayCount;
    });

    fs.writeFile(yearsPath, JSON.stringify(years, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving years.json:', writeErr);
        return res.status(500).send('Error saving years.json');
      }
      res.send('years.json updated successfully');
    });
  });
});

// Watch inputs/examples in dev and notify SSE clients to refresh
if (process.env.NODE_ENV !== 'production') {
  const inputsRoot = path.join(__dirname, 'public', 'inputs');
  const examplesFile = path.join(__dirname, 'public', 'examples.json');
  if (!fs.existsSync(inputsRoot)) {
    fs.mkdirSync(inputsRoot, { recursive: true });
  }
  try {
    fs.watch(inputsRoot, { recursive: true }, (eventType, filename) => {
      if (!filename) return;
      sseClients.forEach((client) => client.write('data: reload\n\n'));
    });
  } catch (err) {
    console.error('Failed to watch inputs directory:', err);
  }

  try {
    fs.watch(examplesFile, () => {
      sseClients.forEach((client) => client.write('data: reload\n\n'));
    });
  } catch (err) {
    console.error('Failed to watch examples.json:', err);
  }
}

// Start the helper server
app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
