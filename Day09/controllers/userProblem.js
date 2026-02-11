const Problem = require("../models/problem");
const Submission = require("../models/submission");
const User = require("../models/user");
const { getLanguageById, submitBatch,submitToken} = require("../utils/problemUtillity");

const createProblem = async (req, res) => {
  
  const {
    title,
    description,
    difficulty,
    tags,
    visibletestcases,
    hiddentestcases,
    startcode,
    referencesolution,
    problemcreator,
  } = req.body;

  try {
    for (const { language, completecode } of referencesolution) {
      let languageId = getLanguageById(language);

      //I am creating Batch submission
      const submission = visibletestcases.map((items) => ({
        source_code: completecode,
        language_id: languageId,
        stdin: items.input,
        expected_output: items.output,
      }));
      //submit batch to judge0
      const submitResult = await submitBatch(submission);

      
      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          let message = "";

          if (test.status_id === 1) {
            message = "In Queue";
          } else if (test.status_id === 2) {
            message = "Processing";
          } else if (test.status_id === 4) {
            message = "Wrong Answer";
          } else if (test.status_id === 5) {
            message = "Time Limit Exceeded";
          } else if (test.status_id === 6) {
            message = "Compilation Error";
          } else if (test.status_id > 6) {
            message = "Runtime Error";
          } else {
            message = "Unknown Error";
          }

          return res.status(400).send(message);
        }
      }

    }

    //now we can store it in DB
    const userProblem = await Problem.create({
      ...req.body,
      problemCreator:req.result._id
    })
    
    res.status(201).send("Problem Saved Successfully");

  } catch (err) {
    res.status(400).send("err: "+err.message)
  }
};

const updateProblem=async(req,res)=>{
console.log("start")
  const {id}=req.params;
  if(!id){
    return res.status(400).send("Id Missing");
  }

  const dsaProblem=await Problem.findById(id);
  if(!dsaProblem){
    return res.status(400).send("Invalid ID")
  }


  const {
    title,
    description,
    difficulty,
    tags,
    visibletestcases,
    hiddentestcases,
    startcode,
    referencesolution,
    problemcreator,
  } = req.body;

   try {
    for (const { language, completecode } of referencesolution) {
      let languageId = getLanguageById(language);

      //I am creating Batch submission
      const submission = visibletestcases.map((items) => ({
        source_code: completecode,
        language_id: languageId,
        stdin: items.input,
        expected_output: items.output,
      }));
      //submit batch to judge0
      const submitResult = await submitBatch(submission);

      
      const resultToken = submitResult.map((value) => value.token);

      const testResult = await submitToken(resultToken);

      for (const test of testResult) {
        if (test.status_id !== 3) {
          let message = "";

          if (test.status_id === 1) {
            message = "In Queue";
          } else if (test.status_id === 2) {
            message = "Processing";
          } else if (test.status_id === 4) {
            message = "Wrong Answer";
          } else if (test.status_id === 5) {
            message = "Time Limit Exceeded";
          } else if (test.status_id === 6) {
            message = "Compilation Error";
          } else if (test.status_id > 6) {
            message = "Runtime Error";
          } else {
            message = "Unknown Error";
          }

          return res.status(400).send(message);
        }
      }
      
    }
    const newProblem = await Problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true})
    res.status(200).send(newProblem)
  }
  catch(err){
    res.status(400).send("error: "+err.message)
  }
}

const deleteProblem=async(req,res)=>{
  try{
     const {id}= req.params;
  if(!id)
    return res.status(404).send("Missing Id");

  const deletedProblem = await Problem.findByIdAndDelete(id);
  if(!deletedProblem)
    return res.status(400).send("Problem is Missing");

  res.status(200).send("Successfully Deleted");
  }
  catch(err)
  {
    res.status(400).send(err.message);
  }
 
}

const getProblemById = async(req,res)=>{
  try{
        const {id}= req.params
     if(!id)
    return res.status(404).send("Missing Id");

    let problem= await Problem.findById(id).select('_id title description difficulty tags visibletestcases startcode referencesolution');
    if(!problem)
      return res.status(404).send("Problem is Missing");

    res.status(200).send(problem)
  }
  catch(err){
    res.status(400).send("err: "+err.message);
  }
}

const getAllProblem= async(req,res)=>{

  const getProblem=await Problem.find({}).select('_id title difficulty tags');
  if(getProblem.length==0)
    return res.status(404).send("No Problems Found")

  res.status(200).send(getProblem)
}

const solvedAllProblemUser=async(req,res)=>{  
   try{
    const userId= req.result._id;
    const user = await User.findById(userId).populate({
      path:'problemSolved',
      select:'_id title tags difficulty'
    })
    res.status(200).send(user.problemSolved);
   }
   catch(err)
{
 res.status(500).send("Server Error: "+err.message)
}
}

const submittedProblem= async(req,res)=>{
    try{
        const userId=req.result._id;
        const problemId=req.params.pid;
        const ans=await Submission.find({userId,problemId});
        if(ans.length===0)
          res.status(200).send("No Submission is Present")

        res.status(200).send(ans);


      
    }
    catch(err)
    {
      res.status(500).send("Internal Server Error: "+err.message)
    }
}
module.exports ={createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemUser,submittedProblem};