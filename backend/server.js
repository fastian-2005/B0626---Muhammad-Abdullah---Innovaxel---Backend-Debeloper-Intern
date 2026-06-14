require('dotenv').config()

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./src/db/database')
const authRoutes = require('./src/routes/authRoutes')
const eventRoutes = require('./src/routes/eventRoutes')
const registrationRoutes = require('./src/routes/registrationRoutes')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/auth',authRoutes)
app.use('/api',eventRoutes)
app.use('/api',registrationRoutes)


app.listen(process.env.PORT || 5000 , () => {
    console.log(`Server running on ${process.env.PORT || 5000}`)
})