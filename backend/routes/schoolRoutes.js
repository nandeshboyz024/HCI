// routes/schoolRoutes.js
import express from 'express';
import { getSchools,getSchool} from '../controllers/schoolControllers.js';

const router = express.Router();

router.post('/get-schools', getSchools);
router.post('/get-school',getSchool);
export default router;