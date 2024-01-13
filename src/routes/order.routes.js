//add order route
import { Router } from "express";
import {addOrder,showActiveOrders,addDistributorToOrder, closeOrder} from "../controllers/orderctrl.controller.js";


    const router=Router();

    router.route('/create-order').post(addOrder);
    router.route('/close-order').post(closeOrder);
    router.route('/active-listings').get(showActiveOrders);
    router.route('/add-distributor-to-order').post(addDistributorToOrder);
    export default router
