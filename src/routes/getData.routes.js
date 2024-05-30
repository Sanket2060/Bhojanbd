//add getData route
import { Router } from "express";
import {getDistributorsRank,getDonorsRank,getOrganizationDetails,getTopDistributors, getTopDonors, getUserDetailsFromName,showActiveOrders,getAllCompletedOrdersForDonor,getUserDetails } from "../controllers/getData.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router();
router.route('/get-top-donors').get(getTopDonors)
router.route('/get-top-distributors').get(getTopDistributors);
router.route('/getdetailsfromname').post(getUserDetailsFromName);
router.route('/active-listings').get(showActiveOrders);
router.route('/getOrganizationDetails').get(getOrganizationDetails);
router.route('/getUserDetails').get(verifyJWT,getUserDetails);
router.route('/getAllCompletedOrdersForDonor').post(getAllCompletedOrdersForDonor);
router.route('/getDonorsRank').post(getDonorsRank);
router.route('/getDistributorsRank').post(getDistributorsRank);

export default router