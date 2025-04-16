// routes/studentsDataRoutes.js
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({storage});

import express from 'express';
import { uploadStudents, getTotalStudents,downloadStudents} from '../controllers/studentsDataControllers.js';

const router = express.Router();

router.post('/upload',upload.single('file'),uploadStudents);
router.post('/get-total-students',getTotalStudents);
router.post('/download-students', downloadStudents);

export default router;