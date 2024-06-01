import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { Donor } from '../models/donor.model.js'
import { Distributor } from '../models/distributor.model.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Bhojan } from "../models/bhojandetails.model.js";
import nodemailer from "nodemailer";
// const resend = new Resend(process.env.RESEND_API_KEY);
const sendOTP = async (userEmail) => {
  console.log("User Email from sendOTP:", userEmail);
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "sanketgbs.21@gmail.com",
        pass: "lide mkhz uekg igbu",
      },
    });
      console.log("Inside main otp logic");
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Bhojan👻" <sanketgbs.21@gmail.com>', // sender address
        to: `${userEmail}`, // list of receivers
        subject: "OTP From Bhojan ", // Subject line
        text: `Your OTP for bhojan.me is`, // plain text body
        html: `<h1>${otp}</h1>`, // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    console.log("OTP from sendOTP:", otp);
    return otp  //send otp back
  }
  catch (error) {
    console.log("Error at sendResult:", error);
    throw new ApiError(500, "Can't send OTP at the moment.Please try again later ");
    // }
  }
}






const generateAccessAndRefreshTokens = async (userId) => { //function to generate Tokens
  try {
    const user = await Donor.findById(userId) || await Distributor.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken; //we can change current database detail by database instance
    await user.save({ validateBeforeSave: false }) //to save the changes on instance and validateBeforeSave tells the code 
    //that not to follow validations (required and other requirements of model but just save the changed data)
    // console.log("Access and refresh Token at generation function:", accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh token");
  }
}





// const registerUser=asyncHandler(async(req,res)=>{   //asyncHandler le pathako function lai try..catch ra async.. await dinxa so code ma feri feri lekhnu pardaina
//     // res.status(200).json({  //res has these properties in it so we can use it
//     //     message:'chai aur code'
//     // })


//     //get data from frontend
//     const {username,email,password,isDonor=false}=req.body;
//     console.log("username",username);


//     //validation-non empty
//     // if (username==''){
//     //     throw new ApiError(400,"username can't be empty");
//     // }

//     if
//     ([username, email, password].some((field) => field?.trim()) === '') //The some function is used to check if at least one element in the array satisfies the provided condition.
//     //here if any of the fields equals '' then it throws error 
//         {
//             throw new ApiError(400,"No fields can't be empty");
//         }



//     //check if user and email already exists
//     let existedUser;
//     if (isDonor){

//          existedUser=await Donor.findOne({       //find any first  data from database which matches the data
//             $or:[{username},{email}]  //check username and email
//         })    
//     }else{
//          existedUser=await Distributor.findOne({       //find any first  data from database which matches the data
//             $or:[{username},{email}]  //check username and email
//         }) 
//     }

//     if (existedUser)
//     {
//         throw new ApiError(401,"Username or email has already been taken");
//     }



//     //create user object-create entry in db
//     let createdUser;
//     if (isDonor){

//          createdUser=await Donor.create({
//             email,
//             password,
//             username:username.toLowerCase()
//         })
//     }
//     else{
//          createdUser=await Distributor.create({
//             email,
//             password,
//             username:username.toLowerCase()
//         })
//     }

// //first look user is created at database and remove password and refresh token field from response
//     let user;
//     console.log("isDonor:",isDonor);
//     if (Boolean(isDonor)){
//         user=await Donor.findById(createdUser._id).select(
//             "-password -refreshToken -OTP"        
//             )
//     }
//     else {
//         user=await Distributor.findById(createdUser._id).select(
//             "-password -refreshToken -OTP"        
//             )
//     }
//     let bhojan=await Bhojan.findById(process.env.BHOJAN_ID);
//     if (bhojan){  //add user to bhojan's tally
//         bhojan.community += 1;
//         await bhojan.save({ validateBeforeSave: false });  
//       }

//     if (!user){
//         throw new Error(500,"Something went wrong while registering the user");
//     }
//     //uncomment after the cloudfare gets the domain name
//     //    const generatedOTP=await sendOTP(user.email);
//     //     user.OTP = generatedOTP;
//     //    await user.validate(false);
//     //    await  user.save({validateBeforeSave:false})   //instance was changed but not saved to database and we don't want the database to validate the required fields
//         //  await user.save(); // Save the changes to the database
//     // return response to api call
//         return res.status(201).json(    //status given here as it comes different place in postman
//             new ApiResponse(200,user,"OTP sent to user")  //???how will it even work
//         )
// })


// const verifyOTP=asyncHandler(async(req,res)=>{
//     const {_id,userOTP,isDonor}=req.body;
//     console.log("UserOTP:",userOTP);
//     if (isDonor){
//      const user=await Donor.findById(_id);
//      if (userOTP==user.OTP){
//         return res
//         .status(200)
//         .json(new ApiResponse(200,{user},"OTP matched"));
//      }
//      else {
//         throw new ApiError(401,"Invalid OTP");
//      }
//     } 
//     else {
//         const user=await Donor.findById(_id);
//      if (userOTP===user.OTP){
//         return res
//         .status(200)
//         .json(new ApiResponse(200,{user},"OTP matched"));
//      }
//      else {
//         throw new ApiError(401,"Invalid OTP");
//      }
//     } 

// })

const temporaryUsers = {}; // Object to temporarily store user information

const registerUser = asyncHandler(async (req, res) => {
  // Get data from frontend
  const { username, email, password, isDonor } = req.body;
  //   console.log("username", username);

  // Validation - non-empty fields
  if ([username, email, password].some((field) => field?.trim()) === '') {
    throw new ApiError(400, "No fields can't be empty");
  }

  // Check if user and email already exist
  const existedUser = isDonor
    ? await Donor.findOne({ $or: [{ username }, { email }] })
    : await Distributor.findOne({ $or: [{ username }, { email }] });

  if (existedUser) {
    throw new ApiError(401, "Username or email has already been taken");
  }

  // Create temporary user object
  const temporaryUser = {
    email,
    password,
    username: username.toLowerCase(),
    isDonor,
  };

  // Generate and send OTP to the user
  const generatedOTP = await sendOTP(temporaryUser.email);
  //   console.log("generatedOTP:",generatedOTP);
  temporaryUser.OTP = generatedOTP;

  // Store the temporary user information
  const userId = Date.now().toString(); // Generate a unique ID
  temporaryUsers[userId] = temporaryUser;
  //   console.log("Temporary users at Register User:",temporaryUsers);
  // Return response to API call
  return res.status(201)
    .json(
      new ApiResponse(200, { userId, email: temporaryUser.email, OTP: generatedOTP }, "OTP sent to user")

    );
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { userId, userOTP } = req.body;
  //   console.log("UserID,userOTP at verify OTP:",userId,userOTP);
  try {
    // Find the temporary user by the provided userId
    const temporaryUser = temporaryUsers[userId];
    // console.log("Our user",temporaryUser);
    // console.log("temporaryUsers",temporaryUsers);

    if (!temporaryUser) {
      throw new ApiError(401, "Invalid user");
    }
    // console.log("After temporary user");
    // Check if the provided OTP matches the one sent
    if (userOTP == temporaryUser.OTP) {
      // console.log("OTP true");
      // Continue with registration completion logic
      // You can now use temporaryUser object to proceed with the registration
      // ...
      const { username, email } = temporaryUser;
      //   console.log("Extracted username,email successfully",username,email);
      return res.status(200).json(new ApiResponse(200, {
        username,
        email
      }, "OTP matched"));
    } else {
      console.log("OTP false");

      throw new ApiError(401, "Invalid OTP");
    }
  } catch (error) {
    // throw new ApiError(500, "Error while verifying OTP.Please try again later");
    if (error instanceof ApiError) {
      // Handle specific API errors
      return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
    } else {
      // Handle other unexpected errors
      throw new ApiError(500, "Error while verifying OTP. Please try again later");
    }
  }

});


const completeRegistration = asyncHandler(async (req, res) => {
  try {
    // console.log("On complete registration");
    const { userId, name, address, contact, isOrganization
      // ,isDonor=false
    } = req.body;
    // console.log("UserId:", userId);
    // console.log("Temporary Users from complete registration:", temporaryUsers);
    // Find the temporary user by the provided userId
    const temporaryUser = temporaryUsers[userId];
    // console.log("Temporary User from complete registration:", temporaryUser);

    if (!temporaryUser) {
      throw new ApiError(401, "Invalid userId.Can't find previously given user's data");
    }
    const { isDonor } = temporaryUser;
    if
      ([name, userId, address, contact].some((field) => field?.trim()) === '') //The some function is used to check if at least one element in the array satisfies the provided condition.
    //here if any of the fields equals '' then it throws error 
    {
      throw new ApiError(400, "No fields can't be empty");
    }



    //check for images,check for avatar(avatar required)
    // console.log("req.files:",req.files);
    // console.log("Before multer path");
    // console.log("Multer req files:", req.files);
    // console.log("Process run 0");
    // console.log("multer path:", req.files?.avatar[0]?.path);  //if undefined whole statement undefined and not printed
    // console.log("Process run 1");
    const hasAvatar = req.files && req.files.avatar && req.files.avatar.length > 0;
if (!hasAvatar) {
    throw new ApiError(400, "Avatars file is required");
}
    const avatarLocalPath = req.files?.avatar[0]?.path;   // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    //???multer middleware giving .files property to req.Where did `avatar` keyword come from???

    // let coverImageLocalPath;
    // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path
    // }


    // if (!avatarLocalPath) {
    //   throw new ApiError(400, "Avatars file is required");
    // }
    // console.log("Got avatar path sucessfully");

    //upload files to cloudanary,check cloudnary avatar url is present or not
    const avatar = await uploadOnCloudinary(avatarLocalPath); //not being called????
    // console.log("Avatar: ",avatar);
    //    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
      throw new ApiError(500, "Avatar file is required");
    }

    // console.log("Avatar is:", avatar.url);
    let updatedUser;
    if (isDonor) {
      try {
        // console.log("Runned from donor");
        updatedUser = await Donor.create(
          {
            name,
            address,
            contact,
            isOrganization,
            avatar: avatar.url,  //cloudinary sends data object
            username: temporaryUser.username,
            email: temporaryUser.email,
            password: temporaryUser.password

          }
        )
        // updatedUser.password=null;
        // updatedUser.refreshToken=null;

      } catch (error) {
        throw new ApiError(500, `Can't create user at database:${error}`)
      }
    }
    else {
      try {
        console.log("Runned from distributor");
        updatedUser = await Distributor.create(
          {
            name,
            address,
            contact,
            isOrganization,
            avatar: avatar.url,
            username: temporaryUser.username,
            email: temporaryUser.email,
            password: temporaryUser.password
          }
          // ,

          // {new:true}
        )
        // updatedUser.password=null;
        // updatedUser.refreshToken=null;
      } catch (error) {
        throw new ApiError(500, `Can't create user at database at Distributor:${error}`)
      }
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(updatedUser._id);
    // console.log("Access token,refresh Token:", accessToken, refreshToken);
    const options = {
      httpOnly: false,
      secure: true
    }
    let finalUser;
    try {
      finalUser = await Donor.findOne({
        _id: updatedUser._id,
      }).select('-refreshToken -password')
        || await Distributor.findOne({ _id: updatedUser._id }).select('-refreshToken -password');
    } catch (error) {
      console.log("User wasn't found at database.");
    }

    let bhojan = await Bhojan.findById(process.env.BHOJAN_ID);
    if (bhojan) {  //add user to bhojan's tally
      bhojan.community = parseInt(bhojan.community) + 1;
      await bhojan.save({ validateBeforeSave: false });
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, finalUser, "User  created successfully"));
  } catch (error) {
    console.log (`Error somewhere at complete registration: ${error}`);
    throw new ApiError(500, `Error somewhere at complete registration: ${error}`);
  }
})


const LoginUser = asyncHandler(async (req, res) => {
  //     //get data from req.body (req->body data)
  const { email, password } = req.body;
  console.log("email from login User:", email);
  if (!email) {
    throw new ApiError("Email or username is required");
  }

  //find user by  email
  const user = await Donor.findOne({
    email,
  })
    || (await Distributor.findOne({ email }));

  console.log("user:", user);
  if (!user) {
    throw new ApiError(404, "user with this email doesn't exists");
  }


  //check password
  console.log("Password:", password);  //simplestring-nonincrepted
  const isPasswordValid = await user.isPasswordCorrect(password);  //????why small user and not Capital->we need the upper instance so,
  console.log("Password valid:", isPasswordValid);
  if (!isPasswordValid) {
    throw new ApiError(404, "Incorrect password");
  }

  //to send data without password and refreshToken
  let apiResultUser;
  apiResultUser = await Donor.findOne({
    email,
  })
    .select('-password -refreshToken')
    .lean()
    || await Distributor.findOne({
      email,
    })
      .select('-password -refreshToken')
      .lean()

  // console.log("Api Result User:",apiResultUser);

  //Generate  Access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);  //id from the instance of the trying to  login account
//access and refreshToken are generated everytime user logs in and refreshToken is deleted from database during logout

  // const loggedInUser=User.findById(user._id).select(  //don't get password and refresh token from database
  //     "-password -refreshToken"
  // ).lean();    //.lean()??? Why to use it here??

  //send cookie
  const options = {   //only modifyable by server not by browser by anyone
    httpOnly: false,
    secure: true
  }

  return res  //cookieParser middleware added hence res object got cookie property
    .status(200)
    .cookie("accessToken", accessToken, options) //accessToken Cookie
    .cookie("refreshToken", refreshToken, options) //refreshToken Cookie
    .json(
      new ApiResponse(200,

        //  user:loggedInUser,accessToken,refreshToken  //????{} missing-> sending multiple at a time???
        apiResultUser

        ,
        "User logged in successfully"
      )
    )
})


const LogoutUser = asyncHandler((req, res) => {
  Donor.findByIdAndUpdate(
    req.user._id,      //user sent by verifyJWT middleware
    {
      $set: {
        refreshToken: undefined   //set refreshToken on database to undefined
      },
    },
    {
      new: true  //when refreshToken is set then when retrieved data from here as const user= then give new data
    }

  ) || Distributor.findByIdAndUpdate(
    req.user._id,      //user sent by verifyJWT middleware
    {
      $set: {
        refreshToken: undefined   //set refreshToken on database to undefined
      },
    },
    {
      new: true  //when refreshToken is set then when retrieved data from here as const user= then give new data
    }

  )

  //set cookies on browser to undefined
  const options = {   //only modifyable by server not by browser by anyone
    httpOnly: false,
    secure: true
  }
  res.
    status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out sucessfully"))




})



export { registerUser, verifyOTP, completeRegistration, LoginUser, LogoutUser }