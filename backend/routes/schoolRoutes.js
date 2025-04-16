// routes/schoolRoutes.js
import express from 'express';
import { getSchools,getSchool,addSchool,updateSchool} from '../controllers/schoolControllers.js';

const router = express.Router();

router.post('/get-schools', getSchools);
router.post('/get-school',getSchool);
router.post('/add-school',addSchool);
router.put('/update-school',updateSchool);
export default router;