const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const {submitCode,runCode}=require("../controllers/userSubmission")
const submitCodeRateLimiter = require("../middleware/submitCodeRateLimiter")
const submissionRouter = express.Router();

submissionRouter.post('/submit/:id',userMiddleware,submitCodeRateLimiter,submitCode)
submissionRouter.post('/run/:id',userMiddleware,runCode)
module.exports=submissionRouter; 