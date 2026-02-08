const redisClient = require("../config/redis");
const User=require("../models/user");
const validate = require("../utils/validator")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const register = async (req,res)=>{
    try{
        //validate the data
        validate(req.body);

        const {firstName,password,emailId}=req.body;

        req.body.password=await bcrypt.hash(password,10);
 
        const user= await User.create(req.body)
        
        const token=jwt.sign({_id:user._id,emailId:user.emailId,role:'user'},process.env.JWT_KEY,{expiresIn:3600});
        res.cookie('token',token,{maxAge:60*60*1000});

        res.status(201).send("User Registered Successfully");   
    }
    catch(err){
        res.status(400).send(err);
    }
}

const login = async(req,res)=>{
    try{
        const {emailId,password}=req.body;

        if(!emailId){
            throw new Error("Invalid Credentials")
        }

        if(!password)
            throw new Error("Invalid Credentials");

        const user= await User.findOne({emailId});
         let match = bcrypt.compare(password,user.password)
         if(!match)
            throw new Error("Invalid Credentials")

         const token= jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWT_KEY,{expiresIn:3600});
         res.cookie('token',token,{maxAge:3600*1000})
        
         res.status(200).send("Login Successfully")
    }
    catch(err){
        res.status(400).send("error: "+err);
    }
}

const logout = async(req,res)=>{

    try{
        
        const {token}= req.cookies;

        const payload = jwt.decode(token)

        await redisClient.set(`token:${token}`,'blocked');
        await redisClient.expireAt(`token:${token}`,payload.exp);
        res.cookie('token',null,{expires:new Date(Date.now())})

        res.status(200).send("Logout Successfully..")

        
    }
    catch(err){
        res.status(503).send("Error: "+err)
    }
}

const adminRegister=async(req,res)=>{

   
     try{
         if(req.result.role!='admin')
        throw new Error("Invalid Credentials");
   
        //validate the data
        validate(req.body);

        const {firstName,password,emailId}=req.body;

        req.body.password=await bcrypt.hash(password,10);
 
        const user= await User.create(req.body)
        
        const token=jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWT_KEY,{expiresIn:3600});
        res.cookie('token',token,{maxAge:60*60*1000});

        res.status(201).send("User Registered Successfully");   
    }
    catch(err){
        res.status(400).send(err.message);
    }

}
module.exports={register,login,logout,adminRegister}