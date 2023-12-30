import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload} from '../middlewares/multer.middleware.js'

  const router=Router();
  

  router.route('/register').post(
    upload.fields([   //keeps files on server with name as name of file????
      {
        name:'avatar',
        maxCount:1
      },
      {
        name:'coverImage',
        maxCount:1
      }
    ])
    ,registerUser);  //on hitting  api/v1/users/register  execute  registerUser controller 
  



  export default router