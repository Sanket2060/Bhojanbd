//add getData route
import { Router } from "express";
import { getTopDistributors, getTopDonors, getUserDetailsFromName } from "../controllers/getData.controller.js";

const router=Router();
router.route('/get-top-donors').get(getTopDonors)
router.route('/get-top-distributors').get(getTopDistributors);
router.route('/getdetailsfromname').post(getUserDetailsFromName);
export default router