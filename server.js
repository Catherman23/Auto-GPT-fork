// server.js
import express           from 'express';
import basicAuth         from 'express-basic-auth';
import path              from 'path';
import { fileURLToPath } from 'url';

// simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 8080;

// ─── Protect ONLY routes under /software ───────────────
app.use(
  '/software',
  basicAuth({
    authorizeAsync: true,
    authorizer: (username, password, cb) => {
      console.log(`🔑 Auth attempt: user="${username}" pass="${password}"`);
      const userOK = username === 'MCatherman';
      const passOK = password === 'Mansfield23';
      cb(null, userOK && passOK);
    },
    challenge: true,
    realm: 'WMS',
  })
);

// ─── Serve your built SPA at /software ─────────────────
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use('/software', express.static(staticPath));

// ─── SPA fallback for any client‐side route under /software ─
app.get('/software/*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// ─── Root route for your splash/login stub ──────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔒 Server running on port ${PORT}`);
});
