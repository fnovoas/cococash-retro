const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const BIN_PATH = path.join(__dirname, 'bin');

function getPrograms() {
  return fs.readdirSync(BIN_PATH).filter(file => {
    const full = path.join(BIN_PATH, file);
    return fs.statSync(full).isFile();
  });
}

function runProgram(program, res) {
  if (!/^[a-zA-Z0-9_-]+$/.test(program)) {
    res.writeHead(400);
    return res.end('Invalid program name');
  }

  const fullPath = path.join(BIN_PATH, program);

  if (!fs.existsSync(fullPath)) {
    res.writeHead(404);
    return res.end('Program not found');
  }

  console.log(`Ejecutando COBOL: ${fullPath}`);

  const child = spawn(fullPath);

  let output = '';
  let errorOutput = '';

  child.stdout.on('data', d => {
    const chunk = d.toString();
    output += chunk;
    console.log(`STDOUT: ${chunk}`);
  });

  child.stderr.on('data', d => {
    const chunk = d.toString();
    errorOutput += chunk;
    console.error(`COBOL STDERR: ${chunk}`);
  });

  child.on('close', code => {
    if (code !== 0) {
      console.error(`Programa terminó con código ${code}`);
      res.writeHead(500);
      return res.end(`Execution error (code ${code}): ${errorOutput}`);
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(output);
  });

  child.on('error', err => {
    console.error('Error ejecutando proceso:', err);
    res.writeHead(500);
    res.end('Failed to execute program');
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    return res.end('ok');
  }

  if (req.url === '/programs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(getPrograms()));
  }

  if (req.url.startsWith('/run/')) {
    const program = req.url.split('/')[2];
    return runProgram(program, res);
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`COBOL core running on port ${PORT}`);
});