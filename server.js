import express from 'express'
import basicAuth from 'express-basic-auth'
import path from 'path'
import { fileURLToPath } from 'url'

// simulate __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const app  = express()
const PORT = process.env.PORT || 8080

// Secure only /software
app.use(
  '/software',
  basicAuth({
    users:   { 'MCatherman': 'Mansfield23' },
    challenge: true,
    realm: 'WMS'
  })
)

// Serve built files
const distPath = path.join(__dirname, 'frontend', 'dist')
app.use('/software', express.static(distPath))

// SPA fallback
app.get('/software/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// Redirect root → /software/
app.get('/', (req, res) => {
  res.redirect('/software/')
})

app.listen(PORT, () => {
  console.log(`🔒 Server listening on port ${PORT}`)
})
