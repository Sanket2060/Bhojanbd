import mongoose, { Schema } from "mongoose";



const orderSchema=new Schema({    
    
    address:{   //???get from current logged in User
        type:String
    },
    foodItems:
       {
        type:String,
       },
    foodForNumberOfPeople:{
        type:Number,
        required:true,
    },
    listedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Donor"
    },
    acceptedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Distributor"
    },
    isActive:{
        type:Boolean,
        default:true
    }
    
    


},{timestamps:true})

export const Order=mongoose.model("Order",orderSchema);