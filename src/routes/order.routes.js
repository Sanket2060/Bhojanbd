//add order route
import { Router } from "express";
import {addOrder,addDistributorToOrder, closeOrder,cancelOrderForDonor,cancelOrderForDistributor, activeListingsForDonor,pendingListingsForDistributor,completedOrderForDonor} from "../controllers/orderctrl.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

    const router=Router();
    router.use(verifyJWT); // Applying middleware to the entire router
    
    router.route('/create-order').post(addOrder);
    router.route('/close-order').post(closeOrder);
    router.route('/add-distributor-to-order').post(addDistributorToOrder);
    router.route('/cancel-order-for-donor').post(cancelOrderForDonor);
    router.route('/cancel-order-for-distributor').post(cancelOrderForDistributor);
    router.route('/active-listings-for-donor').post(activeListingsForDonor);
    router.route('/pending-listings-for-distributor').post(pendingListingsForDistributor);
    router.route('/completed-order-for-donor').post(completedOrderForDonor);
    
    export default router
