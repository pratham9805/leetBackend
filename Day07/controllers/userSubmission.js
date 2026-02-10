const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {getLanguageById,submitBatch,submitToken} =require("../utils/problemUtillity")

const submitCode =async (req,res)=>{

    try{

        const userId =req.result._id;
        const problemId=req.params.id;

        const {code,language}=req.body;

        if(!userId||!problemId||!code||!language){
            return res.status(400).send("Some Field Missing")
        }

        //Kya submission ko store kar du pahle
        const problem= await Problem.findById(problemId);
        const submittedResult = await Submission.create({
            userId,
            problemId,
            language,
            code,
            testcasespassed:0,
            status:'pending',
            testcasestotal:problem.hiddentestcases.length
        })

        //judge0 code ko submit karna he

         let languageId = getLanguageById(language);
        
              //I am creating Batch submission
              const submission = problem.hiddentestcases.map((items) => ({
                source_code: code,
                language_id: languageId,
                stdin: items.input,
                expected_output: items.output,
              }));

               //submit batch to judge0
                    const submitResult = await submitBatch(submission);

                 const resultToken = submitResult.map((value) => value.token);

                 const testResult = await submitToken(resultToken);

                 //submitted result ko update karo

                 let testcasespassed=0;
                 let runtime =0;
                 let memory=0;
                 let status='accepted'
                 let errorMessage=null;
                 for(const test of testResult)
                 {
                    if(test.status_id==3){
                        testcasespassed++;
                        runtime=runtime+parseFloat(test.time);
                        memory=Math.max(memory,test.memory);
                    }
                    else{

                        if(test.status_id==4){
                            status='error';
                            errorMessage=test.stderr;
                        }
                        else{
                            status='wrong';
                            errorMessage=test.stderr;
                        }
                    }
                 }

                 submittedResult.status=status;
                 submittedResult.testcasespassed=testcasespassed;
                 submittedResult.errorMessage=errorMessage;
                 submittedResult.runtime=runtime;
                 submittedResult.memory=memory;

                await submittedResult.save();

                res.status(201).send(submittedResult);

    }
    catch(err)
    {
        res.status(400).send("err"+err.message)
    }
 }

 module.exports = submitCode;