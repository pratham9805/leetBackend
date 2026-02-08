const axios = require('axios')
const submitBatch = async (submissions) => {
  try {
    const response = await axios.post(
      "https://api.judge0.com/submissions/batch?base64_encoded=true&wait=false",
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


const getLanguageById=(lang)=>{
    const language={
        'c++':54,
        'java':62,
        'javascript':63
    }
    return language[lang.toLowerCase()];
}

module.exports={getLanguageById,submitBatch};