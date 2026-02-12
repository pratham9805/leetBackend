const mongoose = require("mongoose");

const {Schema}=mongoose;

const problemSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    difficulty:{
        type:String,
        required:true,
        enum:['easy','medium','hard']
    },
    tags:{
        type:String,
        enum:['array','linkedlist','tree','graph','dp'],
        required:true
    },
    visibletestcases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            },
            explanation:{
                type:String,
                required:true
            }
        }
    ],
    hiddentestcases:[
        {
            input:{
                type:String,
                required:true
            },
            output:{
                type:String,
                required:true
            }
        }
    ],
    startcode:[
        {
            language:{
                type:String,
                required:true
            },
            initialcode:{
                type:String,
                required:true
            }
        }
    ],
    referencesolution:[
        {
            language:{
                type:String,
                required:true
            },
            completecode:{
                type:String,
                required:true
            }
        }
    ],
    problemCreator:{
        type:Schema.Types.ObjectId,
        ref: "user",
        required:true
    }
},{timestamps:true})

const Problem=mongoose.model("problem",problemSchema);
module.exports=Problem;