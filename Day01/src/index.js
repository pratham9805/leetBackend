const express = require("express");
const app=express();
require("dotenv").config();
const main= require("../config/db");
const cookieParser=require("cookie-parser")

app.use(express.json());
app.use(cookieParser())
main()
.then(()=>{
    console.log("DB connected");
    app.listen(process.env.PORT,()=>{
    console.log("Server Listening at Port number "+process.env.PORT);
    })
})
.catch(err=>console.log("error"+err))
