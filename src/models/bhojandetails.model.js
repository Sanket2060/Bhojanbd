import mongoose, { Schema } from "mongoose";

const bhojanSchema=new Schema({
    foodSaved:{
        type:String,
        trim:true,
        default:'0kgs'
    },
    community:{
        type:Number,
        default:0
        },
    numberOfPeopleFeed:{
        type:Number,
        default:0
    }

    
    



},{timestamps:true})


export const Bhojan=mongoose.model("Bhojan",bhojanSchema);