const Problem = require("../models/problem");
const Submission = require("../models/submission");
const {getLanguageById,submitBatch,submitToken} =require("../utils/problemUtillity")

const submitCode =async (req,res)=>{

    try{

        const userId =req.result._id;
        const problemId=req.params.id;

        let {code,language}=req.body;


        if(!userId||!problemId||!code||!language){
            return res.status(400).send("Some Field Missing")
        }
        if(language=='cpp')
            language='c++'

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
                 submittedResult.errormessage=errorMessage;
                 submittedResult.runtime=runtime;
                 submittedResult.memory=memory;

                await submittedResult.save();

                //problemId ko insert karenge userSchema ke problemSolved me if pid  is not there
                if(!req.result.problemSolved.includes(problemId)){
                    req.result.problemSolved.push(problemId);
                    await req.result.save();
                }

                const accepted = (status=='accepted')
                res.status(201).json({
                    accepted,
                    totaltestcases:submittedResult.testcasestotal,
                    passedtestcases:testcasespassed,
                    runtime,
                    memory
                })

    }
    catch(err)
    {
        res.status(400).send("err"+err.message)
    }
 }

 const runCode = async(req,res)=>{
     try{

        const userId =req.result._id;
        const problemId=req.params.id;

        console.log(req.body)
        let {code,language}=req.body;

        if(!userId||!problemId||!code||!language){
            return res.status(400).send("Some Field Missing")
        }
       if(language=='cpp')
            language='c++'

        //Kya submission ko store kar du pahle
        const problem= await Problem.findById(problemId);
      

        //judge0 code ko submit karna he

         let languageId = getLanguageById(language);
        
              //I am creating Batch submission
              const submission = problem.visibletestcases.map((items) => ({
                source_code: code,
                language_id: languageId,
                stdin: items.input,
                expected_output: items.output,
              }));

               //submit batch to judge0
                    const submitResult = await submitBatch(submission);

                 const resultToken = submitResult.map((value) => value.token);

                 const testResult = await submitToken(resultToken);

              let testcasespassed=0;
                 let runtime =0;
                 let memory=0;
                 let status=true
                 let errormessage=null;
                 for(const test of testResult)
                 {
                    if(test.status_id==3){
                        testcasespassed++;
                        runtime=runtime+parseFloat(test.time);
                        memory=Math.max(memory,test.memory);
                    }
                    else{

                        if(test.status_id==4){
                            status=false;
                            errormessage=test.stderr;
                        }
                        else{
                            status=false ;
                            errormessage=test.stderr;
                        }
                    }
                 }


              
                 res.status(201).json({
                    success:status,
                   testcases:testResult,     
                    runtime,
                    memory
                })

    }
    catch(err)
    {
        res.status(400).send("err"+err.message)
    }
 }

 module.exports = {submitCode,runCode};