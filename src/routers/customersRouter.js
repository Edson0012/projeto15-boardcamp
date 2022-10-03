import { Router } from "express";
import { listCustomers, singleClient } from "../controllers/customersControllers.js";

const router = Router();

router.get('/customers', listCustomers);
router.get('/customers', singleClient);


export default router;