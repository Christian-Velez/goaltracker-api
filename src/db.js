import * as dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const connectionString = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose
   .connect(connectionString)
   .then(() => console.log('Connected to mongodb'))
   .catch((err) => console.error('Failed to connect to mongodb', err.message))
