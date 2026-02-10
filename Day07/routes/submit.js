const express = require('express');
const userMiddleware = require('../middleware/userMiddleware');
const {submitCode}=require("../controllers/userSubmission")
const submissionRouter = express.Router();

submissionRouter.post('/submit',userMiddleware,submitCode)