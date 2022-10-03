import { Router } from "express";
import { listCustomers, singleClient, insertClient, updateClient } from "../controllers/customersControllers.js";
import CustomersValidation from "../middlewares/validate.js";

const router = Router();

router.get('/customers', listCustomers);
router.get('/customers/:id', singleClient);
router.post('/customers', CustomersValidation, insertClient);
router.put('/customers/:id', CustomersValidation, updateClient);

export default router;