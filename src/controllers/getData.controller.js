import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Donor } from '../models/donor.model.js'
import { Distributor } from '../models/distributor.model.js'
import { Order } from "../models/order.model.js";
import { Bhojan } from "../models/bhojandetails.model.js";

const getTopDonors=asyncHandler(async function (req,res){
    try {
        const topTenDonators=await Donor.find({})
        .sort({numberOfPeopleFeed:-1})
        .limit(10)
        .select('name username numberOfPeopleFeed avatar address'); // Selecting only the specified fields

        res
        .status(200)
        .json(new ApiResponse(200,{topTenDonators},"Sent top ten donors successfully"))

        
    } catch (error) {
        console.log("Error in retrieving top donors:",error);
        
    }
})

const getTopDistributors=asyncHandler(async function (req,res){
   try {
     const topTenDistributors=await Distributor.find({})
     .sort({fieldName:-1})
     .limit(10)
     .select('name username numberOfPeopleFeed'); // Selecting only the specified fields

     res
     .status(200)
     .json(new ApiResponse(200,{topTenDistributors},"Sent top ten distributors successfully"))
   } catch (error) {
    console.log("Error in retrieving top donors:",error);
   }
})
const getUserDetailsFromName=asyncHandler(async function (req,res){
    const {name}=req.body;
    const user=await Donor.findOne({name}).select("-password -refreshToken")|| await Distributor.findOne({name}).select("-password -refreshToken");
    if (!user){
        throw new ApiError(401,"Invalid name,can't find any user with this name");
    }
    // console.log("User:",user);
    res
    .status(200)
    .json(new ApiResponse(200,{user},"Data of user extracted from name sent"));

})
const showActiveOrders=asyncHandler(async function(req,res){
    const result = await Order.find({ isActive: true });
      // .toArray();
    console.log("Active Listings are:",result);
  
    return res
    .status(200)
    .json(new ApiResponse(200,result?{result}:null,"Active Orders sent successfully"))
  })
export {getTopDistributors,getTopDonors,getUserDetailsFromName,showActiveOrders}