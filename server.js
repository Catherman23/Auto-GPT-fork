import express           from 'express';
import basicAuth         from 'express-basic-auth';
import path              from 'path';
import { fileURLToPath } from 'url';

// simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 8080;

// protect ONLY anything under /software
app.use(
  '/software',
  basicAuth({
    users:   { 'MCatherman': 'Mansfield23' }, // ← your exact user/pass
    challenge: true
  })
);

// serve the built SPA at /software
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use('/software', express.static(staticPath));

// SPA‐style fallback for all client routes under /software
app.get('/software/*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// root login page or stub
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// start!
app.listen(PORT, () => {
  console.log(`🔒 Server running on port ${PORT}`);
});
