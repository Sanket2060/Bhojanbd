import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

  const router=Router();
  

  router.route('/register').post(registerUser);  //on hitting  api/v1/users/register  execute  registerUser controller 
  



  export default router