import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Donor } from '../models/donor.model.js'
import { Distributor } from '../models/distributor.model.js'
import { Order } from "../models/order.model.js";
import { Bhojan } from "../models/bhojandetails.model.js";
const addOrder = asyncHandler(async function (req, res) {
  const { _id, foodItems, platesAvailable, closingTime,title } = req.body;

  // Assuming you have a way to identify the logged-in user, such as through authentication middleware
 
  const user = await Donor.findById(_id);

  if (!user) {
    throw new ApiError(401, "Invalid user. Can't add the order to the database.");
  }

  const order = await Order.create({
    foodItems,
    listedBy: user._id, // Link the order to the currently logged-in Donor
    address: user.address, // Set the address field to the address of the logged-in Donor
    contact:user.contact,
    foodForNumberOfPeople: platesAvailable, // Adjust this based on your requirements
    isActive: true,
    title,
    closingTime
  });

 // Update the order array in the Donor schema
 user.order.push(order._id);
 await user.save(); // Save the updated Donor document


  // Additional logic or response as needed

  res.status(201).json(new ApiResponse(201,order, 'Order created successfully'));
});


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

const closeOrder=asyncHandler(async function(req,res){ //changes orderStatus
  //get user and order Id
  const {_id,_orderId}=req.body;
  const user=await Distributor.findById(_id);
  if (!user){ //null ko lagi pani ready parna paryo
    throw new ApiError(401,"Invalid distributor trying to add order");
  }
  console.log("At the process");
  // console.log("After pushing");
  const order=await Order.findById(_orderId);
  if (!order){
    throw new ApiError(401,"No such order exists or the order has been taken already");
  }
 
  //set order to orderClosed true
  order.orderStatus='closed';
  let updatedOrder;
  try {
   updatedOrder=await order.save({validateBeforeSave:false},{new:true}).select("-password -refreshToken"); 
  } catch (error) {
    throw new ApiError(500,"Didn't updated changes to database");
  }

  //update points to Donor,Distributors and Bhojan
  const {acceptedBy,listedBy}=order;
  const donor=await Donor.findById(listedBy);
  const distributor=await Distributor.findById(acceptedBy); 
  const bhojan=await Bhojan.findById(process.env.BHOJAN_ID);
  
  let updatedDonor,updatedDistributor,updatedBhojan;
  try {
    const foodForNumberOfPeople=await order?.foodForNumberOfPeople;
    if (donor) {
      // Update the number of people served by the Donor
      donor.numberOfPeopleFeed += foodForNumberOfPeople;
      updatedDonor=await donor.save({ validateBeforeSave: false },{new:true}).select("-password -refreshToken");;
    }
  
    if (distributor) {
      // Update the number of people served by the Distributor
      distributor.numberOfPeopleFeed += foodForNumberOfPeople;
      updatedDistributor=await distributor.save({ validateBeforeSave: false });
    }
    if (bhojan){
      bhojan.numberOfPeopleFeed += foodForNumberOfPeople;
      updatedBhojan=await bhojan.save({ validateBeforeSave: false });

    }
  
  } catch (error) {
    throw new ApiError(500,`Problem at updating points to distributor,donor and Bhojan:${error}`)
  }

  //updating points  to Bhojan remaining

  res
  .status(200)
  .json(new ApiResponse(200,{updatedOrder,updatedDonor,updatedDistributor,updatedBhojan},"Order Closed Successfully"));


})

const cancelOrderForDonor=asyncHandler(async function(req,res){
  //take orderId 
  const {_orderId}=req.body;
  //for order,set OrderStatus to cancelled
  const order=await Order.findById(_orderId);
  if (!order){
    throw new ApiError(401,"Invalid orderId");
  }
  order.orderStatus='cancelled';
  await order.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{order},"Order cancelled successfully by donor"));
})

const cancelOrderForDistributor=asyncHandler(async function(req,res){
   //take orderId 
   const {_orderId}=req.body;
   //for order,set OrderStatus to cancelled
   const order=await Order.findById(_orderId);
   if (!order){
     throw new ApiError(401,"Invalid orderId");
   }
   order.orderStatus='cancelled';
  await order.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{order},"Order cancelled successfully by distributor"));

})
const completedOrderForDonor=asyncHandler(async function(req,res){
  //take orderId 
  const {_orderId}=req.body;
  //for order,set OrderStatus to cancelled
  const order=await Order.findById(_orderId);
  if (!order){
    throw new ApiError(401,"Invalid orderId");
  }
  order.orderStatus='completed';
  order.activeStatus='false';
  await order.save({validateBeforeSave:false})

  return res
  .status(200)
  .json(new ApiResponse(200,{order},"Order completed successfully by donor"));
})


const activeListingsForDonor=asyncHandler(async function(req,res){
  const {_id}=req.body;
  console.log("Id is:",_id);
  try {
   const user= await  Donor.findById(_id);
    if (!user){
      console.log("Can't find user with this id");
      throw new ApiError(401,"Can't find user with this id");
    }
    console.log("Reached here");
  //  const orders=await user.order.map((listing,index)=>{
  //     // if (listing.orderStatus=='running'){
  //       console.log(listing._id);
  //       console.log(listing.address);
  //       console.log(`Index:${index} and ${listing.orderStatus}`);
  //       return listing
  //     }
    // }
    // )
    
    // console.log("orders:",orders);
    const allListings=user?.order?.map((listing)=>{
      return listing
    })

    console.log("Active listings:",allListings);
    // Perform further actions on each active listing
    const detailedListings = [];
    for (const listing of allListings) {
      // Assuming you want to find the order details for each active listing
      console.log(listing._id);
      const order = await Order.findById(listing._id);
      if (order.orderStatus=='running')
      detailedListings.push({
        order
      });
    }
    return res
    .status(200)
    .json(new ApiResponse(200,detailedListings,"Active listings for the user sent successfully"));
  } catch (error) {
    throw new ApiError(500,"Can't provide active listings");
  }
})

// const pendingListingsForDistributor=asyncHandler(async function(req,res){
//   const {_id}=req.body;
//   console.log("Id is:",_id);


//   const user=await Distributor.find({_id}).select("-password -refreshToken");
//     if (!user){
//         throw new ApiError(401,"Invalid user Id,can't find any user with this userId");
//     }
//     // console.log("User:",user);
//     // const runningOrders=user.order?.filter((item)=>item.orderStatus=="running");
//     const runningOrders=user?.order?.map((item)=>{
//       const singleOrder=await Order.findById(item);
//       console.log("singleOrder",singleOrder);
//       if (singleOrder.orderStatus=='running')
//       {
//         console.log(singleOrder)
//         return singleOrder
//       }
//     })
//     console.log("Running Orders:",runningOrders);
//     res
//     .status(200)
//     .json(new ApiResponse(200,{runningOrders},"pending listings for asked distributor sent successfully"));
// })

// const pendingListingsForDistributor = asyncHandler(async function (req, res) {
//   try {
//     const { _id } = req.body;
//     console.log("Id is:", _id);

//     const user = await Distributor.find({ _id }).select("-password -refreshToken");
//     if (!user) {
//       throw new ApiError(401, "Invalid user Id, can't find any user with this userId");
//     }

//     const runningOrders = [];
//     for (const item of user?.order || []) {
//       const singleOrder = await Order.findById(item);
//       console.log("singleOrder", singleOrder);
//       if (singleOrder && singleOrder.orderStatus === 'running') {
//         console.log(singleOrder);
//         runningOrders.push(singleOrder);
//       }
//     }

//     console.log("Running Orders:", runningOrders);

//     res
//       .status(200)
//       .json(new ApiResponse(200, { runningOrders }, "pending listings for asked distributor sent successfully"));
//   } catch (error) {
//     // Handle errors appropriately
//     console.error(error);
//     res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
//   }
// });
const pendingListingsForDistributor = asyncHandler(async function (req, res) {
  try {
    const { _id } = req.body;
    console.log("Id is:", _id);

    const user = await Distributor.findOne({ _id }).select("-password -refreshToken"); // Use findOne instead of find
    console.log("User:", user);

    if (!user) {
      throw new ApiError(401, "Invalid user Id, can't find any user with this userId");
    }

    console.log("user.order", user.order);
    const usersRunningOrders = [];
    
    for (const orderId of user.order) {
      console.log("OrderId:", orderId);
const singleOrder = await Order.findById(orderId).exec(); // Ensure exec() is called
            console.log("singleOrder", singleOrder);

      if (singleOrder && singleOrder.orderStatus === 'running') {
        console.log(singleOrder);
        usersRunningOrders.push(singleOrder);
      }
    }

    console.log("Running Orders:", usersRunningOrders);

    res
      .status(200)
      .json(new ApiResponse(200,
         { runningOrders:usersRunningOrders
      },
       "pending listings for asked distributor sent successfully"));
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
  }
});


export  {addOrder,addDistributorToOrder,closeOrder,cancelOrderForDonor,cancelOrderForDistributor,activeListingsForDonor,pendingListingsForDistributor,completedOrderForDonor};
