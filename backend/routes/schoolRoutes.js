// routes/schoolRoutes.js
import express from 'express';
import { getSchools } from '../controllers/schoolControllers.js';

const router = express.Router();

router.post('/get-schools', getSchools);

export default router;
