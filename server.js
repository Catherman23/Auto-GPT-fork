// server.js
import express from 'express';
import basicAuth from 'express-basic-auth';
import path from 'path';
import { fileURLToPath } from 'url';

// simulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 8080;

// 1) Protect everything under '/' with a single user/pass:
app.use(basicAuth({
  users:   { 'arka': 'YourSecretPassword123' },  // ← set your own login
  challenge: true,
}));

// 2) Serve your built frontend:
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(staticPath));

// 3) SPA fallback:
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔒 Server running on http://localhost:${PORT}`);
});
