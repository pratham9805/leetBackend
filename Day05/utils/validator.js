 const validator =require("validator")
 
 const validate =(data)=>{
  
let mandatoryField = ['firstName','emailId','password'];

    const isAllowed = mandatoryField.every((k)=>Object.keys(data).includes(k));
    if(!isAllowed)
        throw new Error("Missing Fields");
     
    if(!validator.isEmail(data.emailId))
        throw new Error("Please enter Correct Email!!!");
    
    if(!validator.isStrongPassword(data.password))
        throw new Error("Enter Strong Password")
    }
   
        
    
   


module.exports=validate;