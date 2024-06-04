import express = require("express")
import {Application, json, Request, Response} from "express";
import {userRouter} from "./routers/Userrouter";
const body_parser = require('body-parser')
import cors from "cors";
import {priceRouter} from "./routers/priceRouter";

const app: Application = express();
app.use(cors());

app.use(json());//helps convert json
app.use("/api",userRouter)//default rout is api
app.use("/transfer",priceRouter)

app.use(body_parser.json());
app.use(body_parser.raw());

app.listen(8080, () =>{//port listening
    console.log("listening on port 8080")
});
//Nodemon - used to create a live server


//What is CRUD?
// GET = READ
// POST = CREATE
// PUT = UPDATE
// DELETE = DELETE

//MVC
// model - DB connection and data work
// view - HTML - shown using the DB with the logic
// controller - logic(functions)