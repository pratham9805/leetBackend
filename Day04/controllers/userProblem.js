
const {getLanguageById,submitBatch} = require("../utils/problemUtillity")

const createProblem= async(req,res)=>{

    const {title,description,difficulty,tags,visibletestcases,hiddentestcases,startcode,referencesolution,problemcreator}=req.body;

    try{
        for(const {language,completecode} of referencesolution){

          let languageId  =getLanguageById(language);

          //I am creating Batch submission
          const submission = visibletestcases.map(items=>({
            source_code:completecode,
            language_id:languageId,
            stdin:items.input,
            expected_output:items.output
            })
          )
          //submit batch to judge0
           const submitResult = await submitBatch(submission);
        }
       
    }
    catch(err){

    }
}