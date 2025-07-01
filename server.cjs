// server.cjs
const express     = require('express');
const basicAuth   = require('express-basic-auth');
const path        = require('path');

const app  = express();
const PORT = process.env.PORT || 8080;

// protect everything under '/'
app.use(basicAuth({
  users: { 'arka': 'YourSecretPassword123' },  // ← set your own user/password
  challenge: true,
}));

// serve the built frontend
const staticPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(staticPath));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🔒 Server running on port ${PORT}`);
});
