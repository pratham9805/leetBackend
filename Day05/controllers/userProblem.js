const Problem = require("../models/problem");
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
    
    res.status(401).send("Problem Saved Successfully");

  } catch (err) {
    res.status(400).send("err: "+err.message)
  }
};

module.exports ={createProblem};