import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
const registerUser=asyncHandler(async(req,res)=>{   //asyncHandler le pathako function lai try..catch ra async.. await dinxa so code ma feri feri lekhnu pardaina
    // res.status(200).json({  //res has these properties in it so we can use it
    //     message:'chai aur code'
    // })
    

    //get data from frontend
    const {username,email,fullname,password}=req.body;
    console.log("username",username);

    //validation-non empty
    // if (username==''){
    //     throw new ApiError(400,"username can't be empty");
    // }

    if
    ([username, email, fullname, password].some((field) => field?.trim()) === '') //The some function is used to check if at least one element in the array satisfies the provided condition.
    //here if any of the fields equals '' then it throws error 
        {
            throw new ApiError(400,"No fields can't be empty");
        }



    //check if user already exists
    const existedUser=await User.findOne({       //find any first  data from database which matches the data
        $or:[{username},{email}]  //check username and email
    })   

    if (existedUser)
    {
        throw new ApiError(401,"Username or email has already been taken");
    }


    //check for images,check for avatar(avatar required)
    console.log("req.files:",req.files);
    console.log("multer path:",req.files?.avatar[0]?.path);
    const avatarLocalPath= req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.avatar[0]?.path;
    //???multer middleware giving .files property to req.Where did `avatar` keyword come from???

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    //upload files to cloudanary,check cloudnary avatar url is present or not
   const avatar=await uploadOnCloudinary(avatarLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar){
    throw new ApiError(400,"Avatar file is required");
}

    //create user object-create entry in db
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

//first look user is created at database and remove password and refresh token field from response
    const createdUser=User.findById(user._id).select(
        "-password -refreshToken"        
    )

    if (!createdUser){
        throw new Error(500,"Something went wrong while registering the user");
    }



    // return response to api call
        return res.status(201).json(    //status given here as it comes different place in postman
            new ApiResponse(200,createdUser,"User registered successfully")  //???how will it even work
        )






})

export  {registerUser}