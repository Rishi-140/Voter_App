const express=require('express')
const app=express()
const db = require('./db')
//require('dotenv').config()

const bodyparser=require('body-parser')
app.use(bodyparser.json())




const userroutes=require('./routes/userRoutes')
app.use('/user',userroutes)

const candidateroutes=require('./routes/candidateRoutes')
app.use('/candidate',candidateroutes)




const PORT=process.env.PORT||5000
app.listen(PORT,()=>{console.log('Port run on 5000')})

