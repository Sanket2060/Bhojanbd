import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Donor } from '../models/donor.model.js'
import { Distributor } from '../models/distributor.model.js'
import { Order } from "../models/order.model.js";

const addOrder = asyncHandler(async function (req, res) {
  const { _id, foodItems, platesAvailable, closingTime } = req.body;

  // Assuming you have a way to identify the logged-in user, such as through authentication middleware
 
  const user = await Donor.findById(_id);

  if (!user) {
    throw new ApiError(401, "Invalid user. Can't add the order to the database.");
  }

  const order = await Order.create({
    foodItems,
    listedBy: user._id, // Link the order to the currently logged-in Donor
    address: user.address, // Set the address field to the address of the logged-in Donor
    foodForNumberOfPeople: platesAvailable, // Adjust this based on your requirements
    isActive: true,
  });

 // Update the order array in the Donor schema
 user.order.push(order._id);
 await user.save(); // Save the updated Donor document


  // Additional logic or response as needed

  res.status(201).json(new ApiResponse(201, 'Order created successfully', order));
});


const showActiveOrders=asyncHandler(async function(req,res){
  const result = await Order.find({ isActive: true });
    // .toArray();
  console.log("Active Listings are:",result);

  return res
  .status(200)
  .json(new ApiResponse(200,result?{result}:null,"Active Orders sent successfully"))
})

const addDistributorToOrder=asyncHandler(async function(req,res){
  const {_id,_orderId} =req.body;
  const user=await Distributor.findById(_id);
  // console.log("User as distributor: ",user);
  if (!user){ //null ko lagi pani ready parna paryo
    throw new ApiError("Invalid distributor trying to add order");
  }
  // console.log("After pushing");
  const order=await Order.findById(_orderId);
  if (!order){
    throw new ApiError(401,"No such order exists or the order has been taken already");
  }
  

  //add acceptedBy to order
  order.acceptedBy=user._id;
  order.isActive=false; //as the user has accepted it
  // console.log(user.order);
  // user.order.map((storedOrder)=>{             //array ma orders duplicate huna vayena->doesn't runs due to asyncronicity
  //   if (storedOrder==order._id){
  //   throw new ApiError(401,"Order already added to the distributor.Don't resend the order");
  //   }
  // })

  user.order.forEach((storedOrder) => {
    if (storedOrder.equals(order._id)) {
      throw new ApiError(401, "Order already added to the distributor. Don't resend the order");
    }
  });
  
  await user.order.push(order);

  
  // Save the changes to the database
  const changedOrder=await order.save({validateBeforeSave:false});
  const changedUser=await user.save({validateBeforeSave:false});
  
  return res
  .status(200)
  .json(new ApiResponse(200,{changedUser,changedOrder},"Order assigned to distributor sucessfully"));


})
export  {addOrder,showActiveOrders,addDistributorToOrder};
