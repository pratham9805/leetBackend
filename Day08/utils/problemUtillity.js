const axios = require('axios')
const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      "https://ce.judge0.com/submissions/batch?base64_encoded=false&wait=false",
      { submissions },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    return response.data; // tokens
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};


const waiting = async(timer)=>{
    setTimeout(() => {
        return 1;
    }, timer);
}

const submitToken = async (resultToken) => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://ce.judge0.com/submissions/batch",
        {
          params: {
            tokens: resultToken.join(","),
            base64_encoded: "false",
            fields: "*"
          }
        }
      );
      return response.data;
    } catch (error) {
        console.error(
        "Judge0 fetch error:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  while (true) {
    const result = await fetchData();

   
    if (!result || !result.submissions) {
      await waiting(1000);
      continue;
    }

    // status_id:
    // 1 = In Queue
    // 2 = Processing
    // >2 = Finished
    const isResultObtained = result.submissions.every(
      (r) =>  r.status_id > 2
    );

    if (isResultObtained) {
      return result.submissions;
    }

    await waiting(1000); // poll every 1 sec
  }
};



const getLanguageById=(lang)=>{
    const language={
        'c++':54,
        'java':62,
        'javascript':63
    }
    return language[lang.toLowerCase()];
}

module.exports={getLanguageById,submitBatch,submitToken};








