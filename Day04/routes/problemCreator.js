const express= require("express");
const problemRouter = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware =require("../middleware/userMiddleware")
problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.patch("'/:id",adminMiddleware,updateProblem);
problemRouter.delete("'/:id",adminMiddleware,deleteProblem);

problemRouter.get("/:id",userMiddleware,getProblem);
problemRouter.get("/",userMiddleware,getAllProblem);
problemRouter.get("/user",userMiddleware,solvedAllProblemUser)

