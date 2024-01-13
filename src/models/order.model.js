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
    isActive:{  //aru volunteer le liye pani false hunxa
        type:Boolean,
        default:true
    },
    orderClosed:{ //order ko kaam vaisakexa vane close hunxa
        type:Boolean,
        default:false
    },
    orderStatus:{
        type:String,
        default:'running',
        options:['completed','cancelled','closed'] //completed for volunteer's side,cancelled for volunteer's side and closed from donor side
    }
    
    


},{timestamps:true})

export const Order=mongoose.model("Order",orderSchema);