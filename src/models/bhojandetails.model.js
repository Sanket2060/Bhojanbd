import mongoose, { Schema } from "mongoose";

const bhojanSchema=new Schema({
    foodSaved:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //makes optimised for searching  username
    },
    community:{
        type:Number
    },
    totalPeopleServed:{
        type:Number
    }

    
    



},{timestamps:true})


export const Bhojan=mongoose.model("Bhojan",bhojanSchema);