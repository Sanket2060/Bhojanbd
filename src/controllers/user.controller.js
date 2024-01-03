import { asyncHandler } from "../utils/AsyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/Cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const generateAccessAndRefreshTokens=async (userId)=>{ //function to generate Tokens
 try {
    const user=await User.findById(userId);
    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();  
    user.refreshToken=refreshToken; //we can change current database detail by database instance
  await  user.save({validateBeforeSave:false}) //to save the changes on instance and validateBeforeSave tells the code 
    //that not to follow validations (required and other requirements of model but just save the changed data)

    return {accessToken,refreshToken};
 } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access and refresh token");
 }





}


const registerUser=asyncHandler(async(req,res)=>{   //asyncHandler le pathako function lai try..catch ra async.. await dinxa so code ma feri feri lekhnu pardaina
    // res.status(200).json({  //res has these properties in it so we can use it
    //     message:'chai aur code'
    // })
    

    //get data from frontend
    const {username,email,fullName,password}=req.body;
    console.log("username",username);

    //validation-non empty
    // if (username==''){
    //     throw new ApiError(400,"username can't be empty");
    // }

    if
    ([username, email, fullName, password].some((field) => field?.trim()) === '') //The some function is used to check if at least one element in the array satisfies the provided condition.
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
    // console.log("req.files:",req.files);
    console.log("Before multer path");
    console.log("Multer req files:",req.files);
    console.log("multer path:",req.files?.avatar[0]?.path);  //if undefined whole statement undefined and not printed
    const avatarLocalPath = req.files?.avatar[0]?.path;   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    //???multer middleware giving .files property to req.Where did `avatar` keyword come from???

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }
    

    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    //upload files to cloudanary,check cloudnary avatar url is present or not
   const avatar=await uploadOnCloudinary(avatarLocalPath);
   const coverImage=await uploadOnCloudinary(coverImageLocalPath);

   if (!avatar){
    throw new ApiError(500,"Avatar file is required");
}

    //create user object-create entry in db
    const user=await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

//first look user is created at database and remove password and refresh token field from response
    const createdUser=await User.findById(user._id).select(
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

const LoginUser=asyncHandler(async(req,res)=>{
    //get data from req.body (req->body data)
    const {email,username,password}=req.body;
    if (!email || !username)
    {
        throw new Error("Email or username is required");
    }

    //find user by username or email
   const user=await User.findOne({
        $or:[{username},{email}]
    })

    if (!user){
        throw new Error(404,"user with this username doesn't exists");
    }


    //check password
   const isPasswordValid=await user.methods.isPasswordCorrect(password);  //????why small user and not Capital
   //???check for this.password at this function
   if (!user){
    throw new Error(404,"Incorrect password");
}

   
   //Generate  Access and refresh token
   const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id);  //id from the instance of the trying to  login account


   //send cookie
    const loggedInUser=User.findById(user._id).select(  //don't get password and refresh token from database
        "-password -refreshToken"
    );
    
    const options={   //only modifyable by server not by browser by anyone
        httpOnly:true,
        secure:true
    }

    return res  //cookieParser middleware added hence res object got cookie property
    .status(200)
    .cookie("accessToken",accessToken,options) //accessToken Cookie
    .cookie("refreshToken",refreshToken,options) //refreshToken Cookie
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,accessToken,refreshToken  //????{} missing-> sending multiple at a time
        },
         "User logged in successfully"
        )
    )

    


   
   





})
const LogoutUser=asyncHandler((req,_)=>{
    User.findByIdAndUpdate(
        req.user._id,      //user sent by verifyJWT middleware
        {
            $set:{
                refreshToken:undefined   //set refreshToken on database to undefined
            },    
        },
        {
            new:true  //when refreshToken is set then when retrieved data from here as const user= then give new data
        }
        
    )
    
    //set cookies on browser to undefined
    const options={   //only modifyable by server not by browser by anyone
        httpOnly:true,
        secure:true
    }
    res.status
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged out sucessfully"))
    



})


export  {registerUser,LoginUser,LogoutUser}