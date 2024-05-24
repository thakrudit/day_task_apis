const express = require('express')
const app = express()
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(bodyParser.json());

const userRoutes = require("./routes/userAuth")
const projectRoutes = require("./routes/tasks")

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/tasks", projectRoutes)

const PORT = process.env.APP_PORT || 5555
app.listen(PORT, ()=>{
    console.clear()
    console.log(`${process.env.APP_NAME} Server is running on port ${PORT}`)
})

module.exports= app