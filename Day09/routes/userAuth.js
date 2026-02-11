const express=require("express")

const authRouter = express.Router();
const {register,login,logout,adminRegister,deleteProfile}=require("../controllers/userAuthent")
const userMiddleware=require("../middleware/userMiddleware")


authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post("/logout",userMiddleware,logout);
authRouter.post("/admin/register",userMiddleware,adminRegister)
authRouter.delete("/profile",userMiddleware,deleteProfile)
// authRouter.post('/getProfile',getProfile);

module.exports=authRouter;