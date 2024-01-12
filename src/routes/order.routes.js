//add order route
import { Router } from "express";
import {addOrder,showActiveOrders,addDistributorToOrder} from "../controllers/orderctrl.controller.js";


    const router=Router();

    router.route('/create-order').post(addOrder);
    router.route('/active-listings').get(showActiveOrders);
    router.route('/add-distributor-to-order').post(addDistributorToOrder);
    export default router
