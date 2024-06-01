import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken"; //???
import { Donor } from "../models/donor.model.js";
import { Distributor } from "../models/distributor.model.js";
import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  // const refToken= req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer","")
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    //Authorization: Bearer token
    //Mobile apps don't have cookies so getting accessToken from req.header but the data is in upper form.
    //But we don't want Bearer but just token so replacing Bearer to "" empty string so that we get token only

    if (!token) {
      throw new ApiError(401, "Unauthorized request"); //??401 as unauthorized error???
    }
    //decrypt the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); //the decoded token has all data sent during encoding of token
    //find user from token on database to verify
    let user =
      await Donor.findById(decodedToken?._id).select(
        "-password -refreshToken"
      ) ||
    await  Distributor.findById(decodedToken?._id).select("-password -refreshToken");
    //_id was given when token  was made(encryption happened)
    //    console.log("User at verifyjwt",user);
    // console.log("usered",user);
    if (!user) {
      throw new ApiError(401, "Invalid access token"); //??401 as unauthorized error???
    }
    req.user = user; //req object gets user property by this middleware
    // console.log("middleware passed successfully");
    // console.log("user", user);
    next();
  } catch (error) {
    if (error == "TokenExpiredError: jwt expired") {
      console.log("Access token expired");
      // console.log("From req",refToken);
      const decodedToken = jwt.verify(
        refToken,
        process.env.REFRESH_TOKEN_SECRET
      ); //the decoded token has all data sent during encoding of token
      //find user from token on database to verify
      const user =
        (await Donor.findById(decodedToken?._id).select(
          "-password -refreshToken"
        )) ||
        Distributor.findById(decodedToken?._id).select(
          "-password -refreshToken"
        );
      console.log("From database", user);
      if (user) {
        console.log("Refresh token matched");
        const { accessToken } = await user.generateAccessToken(); //id from the instance of the trying to  login account
        console.log("successfully updated access token");
        const options = {
          //only modifyable by server not by browser by anyone
          httpOnly: false,
          secure: true,
        };
        return res //cookieParser middleware added hence res object got cookie property
          .status(200)
          .cookie("accessToken", accessToken, options) //accessToken Cookie
          .json(
            new ApiResponse(
              200,
              { accessToken },
              "There was an error.Access Token was expired and is updated.Please try again"
            )
          );
      } else {
        throw new ApiError(500, "Invalid user");
      }
    } else {
      console.log("Can't validate from access token at the moment:", error);
      throw new ApiError(500, "Can't validate from access token at the moment");
    }
  }
});
