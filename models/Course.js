import mongoose from "mongoose";
import validator from "validator"; 

const schema = new mongoose.Schema({

    title:{
        type:String,
        required:[true,"Please Enter Course Title"],
        minLength:[4,"Title must be atlease 4 characters"],
        maxLength:[80,"Tirle can't exceed 80 character"],  
    },
    description:{
        type:String,
        required:[true,"Please enter course description"],
        minLength:[20,"description must be atleast 20 characters"],
    },
    lectures:[
        {
            title:{
                type:String,
                required:true,
            },
            description:{
                type:String,
                required:true,
            },
            video:{
                public_id:{
                    type:String,
                    required:true,
                },
                url:{
                    type:String,
                    required:true,
                },
            }
        }
    ],
    poster:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
    views:{
        type:Number,
        default:0,
    },
    numOfVideos:{
        type:Number,
        default:0,
    },
    category:{
        type:String,
        required:true,
    },
    createdBy:{
        type:String,
        rewuired:[true,"Enter the creator name"],
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },






});

export const Course = mongoose.model("Course",schema); 