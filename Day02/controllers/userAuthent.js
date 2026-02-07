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
        
        const token=jwt.sign({_id:user._id,emailId:user.emailId},process.env.JWT_KEY,{expiresIn:3600});
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

         const token= jwt.sign({_id:user._id,emailId:user.emailId},process.env.JWT_KEY,{expiresIn:3600});
         res.cookie('token',token,{maxAge:3600*1000})
        
         res.status(200).send("Login Successfully")
    }
    catch(err){
        res.status(400).send("error: "+err);
    }
}

const logout = async(req,res)=>{

    try{
        
    }
    catch(err){
        res.status(500).send("Error: "+err)
    }
}

module.exports={register}