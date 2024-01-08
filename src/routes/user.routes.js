import { Router } from "express";
import { registerUser,verifyOTP,completeRegistration,LoginUser,LogoutUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

  const router=Router();
  

  router.route('/register').post(
    registerUser);  //on hitting  api/v1/users/register  execute  registerUser controller 
  
  router.route('/verify-otp').post(  //verify otp
    verifyOTP)


  router.route('/complete-registration').post(  //
  upload.fields([   //keeps files on server with name as name of file????
  {
    name:'avatar',
    maxCount:1
  },
  // {
  //   name:'coverImage',
  //   maxCount:1
  // }
])
    ,completeRegistration)

  router.route('/login').post(LoginUser);
  router.route('/logout').post(verifyJWT,LogoutUser);

  
//   //secured routes Why secured??
//   router.route('/logout').post(verifyJWT,LogoutUser);
  



  export default router