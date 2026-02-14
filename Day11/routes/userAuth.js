const express=require("express")

const authRouter = express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require("../controllers/userAuthent")
const userMiddleware=require("../middleware/userMiddleware")


authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",userMiddleware,adminRegister)
authRouter.delete("/profile",userMiddleware,deleteProfile)
authRouter.get("/check",userMiddleware,(req,res)=>{
    const reply={
        emailId:req.result.emailId,
        firstName:req.result.firstName,
        _id:req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})
// authRouter.post('/getProfile',getProfile);

module.exports=authRouter;