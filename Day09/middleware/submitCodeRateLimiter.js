const redisClient = require("../config/redis");

const submitCodeRateLimiter=async(req,res,next)=>{
    const userId= req.result._id;
    const rediskey=`submit_cooldown:${userId}`;

    try{
        //Check if user has a recent submission
        const exists = await redisClient.exists(rediskey);

        if(exists)
        {
            return res.status(429).json({
                error:'Please wait 10 sec before submitting again'
            })
        }

        //set Cooldown Period
        await redisClient.set(rediskey,'cooldown_active',{
            EX:10, //expire after 10 sec
            NX:true //Only set if Not exists
        });
        next();
    }
    catch(error){
        console.log("Rate Limiter Error"+error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
}

module.exports=submitCodeRateLimiter;