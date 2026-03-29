const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3002;
const HOST = '0.0.0.0';
const BIN_PATH = path.join(__dirname, 'bin');

function getPrograms() {
  return fs.readdirSync(BIN_PATH).filter(file => {
    const full = path.join(BIN_PATH, file);
    return fs.statSync(full).isFile();
  });
}

function runProgram(req, program, res) {
  // Validación básica de nombre
  if (!/^[a-zA-Z0-9_-]+$/.test(program)) {
    res.writeHead(400);
    return res.end('Invalid program name');
  }

  const fullPath = path.join(BIN_PATH, program);

  // Verificar que el binario exista
  if (!fs.existsSync(fullPath)) {
    res.writeHead(404);
    return res.end('Program not found');
  }

  console.log(`Ejecutando COBOL: ${fullPath}`);

  const url = new URL(req.url, `http://${req.headers.host}`);
  const msg = url.searchParams.get('msg') || '';

  console.log("Query param msg:", msg);

  const child = spawn(fullPath, msg ? [msg] : []);

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
    console.log(`Proceso finalizado con código ${code}`);

    if (code !== 0) {
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
  console.log("REQUEST URL RAW:", req.url);

  if (req.url === '/health') {
    res.writeHead(200);
    return res.end('ok');
  }

  if (req.url === '/programs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(getPrograms()));
  }

  if (req.url.startsWith('/run/')) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const program = url.pathname.split('/')[2];

    console.log("URL:", req.url);
    console.log("Pathname:", url.pathname);
    console.log("Program:", program);

    return runProgram(req, program, res);
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, HOST, () => {
  console.log(`COBOL core running on http://${HOST}:${PORT}`);
});
