//add order route
import { Router } from "express";
import {addOrder,showActiveOrders,addDistributorToOrder, closeOrder,cancelOrderForDonor,cancelOrderForDistributor} from "../controllers/orderctrl.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

    const router=Router();
    router.use(verifyJWT); // Applying middleware to the entire router
    
    router.route('/create-order').post(addOrder);
    router.route('/close-order').post(closeOrder);
    router.route('/active-listings').get(showActiveOrders);
    router.route('/add-distributor-to-order').post(addDistributorToOrder);
    router.route('/cancel-order-for-donor').post(cancelOrderForDonor);
    router.route('/cancel-order-for-distributor').post(cancelOrderForDistributor);

    export default router
