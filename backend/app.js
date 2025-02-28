const express=require('express')
require('dotenv').config()
const connectToDB=require('./config/connectToDB')
const cors=require('cors')
const xss=require('xss-clean')
const rateLimiting=require('express-rate-limit')
const helmet=require('helmet')
const hpp=require('hpp')
const {errorHandler,notFound}=require('./middlewares/error')

// Init app
const app=express()

// Connect to DB
connectToDB()

// Middlewares
app.use(express.json())

// Security headers (Helmet)
app.use(helmet())

// Prevent hpp(http params pollution)
app.use(hpp())

// Prevent xss attack
app.use(xss())

// Rate limiting
app.use(rateLimiting({
    windowMs:10*60*1000, // 10 minutes
    max:150
}))

// Cors policy
app.use(cors({
    origin:process.env.CLIENT_DOMAIN
}))

// Routes
app.use('/api/auth',require('./routes/authRoute'))
app.use('/api/users',require('./routes/usersRoute'))
app.use('/api/posts',require('./routes/postRoute'))
app.use('/api/comments',require('./routes/commentRoute'))
app.use('/api/categories',require('./routes/categoryRoute'))
app.use('/api/password',require('./routes/passwordRoute'))

// Not found
app.use(notFound)

// Error handler
app.use(errorHandler)

// Running the server
const PORT=process.env.PORT//8000
app.listen(PORT,() => { console.log(`Server is running now in ${process.env.NODE_ENV} mode on port ${PORT}`) })