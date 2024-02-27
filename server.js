// import express & dotenv
const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')

// Load env vars
dotenv.config({ path: './config/config.env' })

// Connect to database
connectDB()

// Create app
const app = express()

// Body JSON Parser
app.use(express.json())
app.use(cookieParser())

// Routing Tester
// app.get('/', (req, res) => {
//   res.status(200).json({ success: true })
// })
// const tests = require('./routes/test')
// app.use('/test', tests)

// Routing
const campgrounds = require('./routes/campgrounds')
const auth = require('./routes/auth')
const users = require('./routes/user')

app.use('/api/campgrounds', campgrounds)
app.use('/api/auth', auth)
app.use('/api/users', users)
// const campgrounds = require('./routes/campgrounds')
// app.use('/api/auth')
// const campgrounds = require('./routes/campgrounds')
// app.use('/api/user')
// const campgrounds = require('./routes/campgrounds')
// app.use('/api/reserves')

// setting up port
const PORT = process.env.PORT || 5000
const server = app.listen(
  PORT,
  console.log(
    'Server running in ',
    process.env.NODE_ENV,
    ' mode on port ',
    PORT
  )
)

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Err: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
