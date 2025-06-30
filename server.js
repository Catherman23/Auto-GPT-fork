const express     = require('express')
const basicAuth   = require('express-basic-auth')
const path        = require('path')

const app  = express()
const PORT = process.env.PORT || 8080

// 1) Protect everything under '/' with a single user/pass:
app.use(basicAuth({
  users: { 'MCatherman': 'Mansfield23' },  // ← change these
  challenge: true                           // show browser login
}))

// 2) Parse URL-encoded form bodies (for /login POST)
app.use(express.urlencoded({ extended: true }))

// 3) Serve your built frontend
const staticPath = path.join(__dirname, 'frontend', 'dist')
app.use(express.static(staticPath))

// 4) Handle the login form POST (so it doesn’t 404)
app.post('/login', (req, res) => {
  // you could inspect req.body.username / req.body.password here
  return res.redirect('/')
})

// 5) Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log('🔒 Server running with basic auth on http://localhost:' + PORT)
})
