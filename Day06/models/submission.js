const mongoose =require('mongoose')
const {Schema}=mongoose;

const submissionSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true,
        enum:['java','javascript','cpp']
    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number, //miliseconds
        default:0
    },
    memory:{
        type:Number, //kb
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    }
    
})