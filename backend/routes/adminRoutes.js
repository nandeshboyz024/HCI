// routes/adminRoutes.js
import express from 'express';
import { showAdmin, verifyAdmin, changeAdminPassword} from '../controllers/adminControllers.js';


const router = express.Router();

router.get('/show-admin-id', showAdmin);
router.post('/varify-admin', verifyAdmin);
router.post('/change-admin-password',changeAdminPassword);



export default router;
