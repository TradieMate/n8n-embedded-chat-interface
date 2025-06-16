import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

// Enable CORS and iframe embedding
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('X-Frame-Options', 'ALLOWALL');
  next();
});

// Serve static files from output directory
app.use(express.static(path.join(__dirname, 'output')));

// Serve the production demo page as the main landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'production-demo.html'));
});

// Serve the widget script at a dedicated endpoint
app.get('/widget.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'output', 'index.umd.cjs'));
});

// Also serve it at the original path for backward compatibility
app.get('/index.umd.cjs', (req, res) => {
  res.sendFile(path.join(__dirname, 'output', 'index.umd.cjs'));
});

// Serve demo page (same as root now)
app.get('/demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'production-demo.html'));
});

// Serve local demo page
app.get('/local-demo', (req, res) => {
  res.sendFile(path.join(__dirname, 'demo.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'n8n-chat-interface' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`N8N Chat Interface server listening on port ${port}`);
  console.log(`Landing page: http://localhost:${port}/`);
  console.log(`Demo page: http://localhost:${port}/demo`);
  console.log(`Widget script: http://localhost:${port}/widget.js`);
  console.log(`Legacy script: http://localhost:${port}/index.umd.cjs`);
});