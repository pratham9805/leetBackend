const jwt =require("jsonwebtoken")
const User = require("../models/user");
const redisClient = require("../config/redis");
const userMiddleware = async(req,res,next)=>{
    try{
           const {token}=req.cookies;
    if(!token)
        throw new Error("Token is Missing");

   const payload= jwt.verify(token,process.env.JWT_KEY);

   const {_id}=payload;

  let result= await User.findById(_id);
  if(!result)
    throw new Error("User Not Found")

  const isBlocked=await redisClient.exists(`token:${token}`);
  if(isBlocked){
    throw new Error("Invalid Token");
  }

  req.result=result;
  next();

    }
    catch(err)
    {
        res.status(401).send("Err"+err)
    }
 
}
module.exports=userMiddleware;