const express = require('express')
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(bodyParser.json());

const userRoutes = require("./routes/userAuth")

app.use("/api/v1/user", userRoutes)

const PORT = process.env.APP_PORT || 5555
app.listen(PORT, ()=>{
    console.clear()
    console.log(`${process.env.APP_NAME} Server is running on port ${PORT}`)
})

module.exports= app