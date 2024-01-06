import mongoose, { Schema } from "mongoose";



const foodItemSchema=new Schema({    
    
    foodItem:{
        type:String,
        required:true
    },
    foodCategory:{
        type:String,  //supper,rice,curry,etc.
        required:true
    },
    description:{
        type:String,
        default:""
    }
    


},{timestamps:true})

export const FoodItem=mongoose.model("FoodItem",foodItemSchema);

