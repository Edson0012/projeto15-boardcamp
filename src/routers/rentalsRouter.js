import { Router } from "express";
import { listRentals, insertRentals, deleteRentals, returnRentals} from "../controllers/rentalsController.js";

const router = Router();

router.get('/rentals', listRentals);
router.post('/rentals', insertRentals);
router.post('/rentals/:id/return', returnRentals);
router.delete('/rentals/:id', deleteRentals);

export default router;