// routes/schoolRoutes.js
import express from 'express';
import { getSchools,getSchool,addSchool,updateSchool, getClasses, getSections , getStudentsForPrimaryScreening, primaryScreeningSubmitForm, secondaryScreeningSubmitForm, getStudentsForSecondaryScreening, primaryTestedCountStudentsBySchool, getTotalStudentsBySchool, getSecondaryTestedCountStudentsBySchool} from '../controllers/schoolControllers.js';

const router = express.Router();

router.post('/get-schools', getSchools);
router.post('/get-school',getSchool);
router.post('/add-school',addSchool);
router.put('/update-school',updateSchool);

//sumit's routes

router.post('/getClasses' , getClasses);
router.post('/getSections', getSections);
router.post('/getStudentsForPrimaryScreening', getStudentsForPrimaryScreening);
router.post('/primaryScreeningSubmitForm' ,primaryScreeningSubmitForm);
router.post('/secondaryScreeningSubmitForm' , secondaryScreeningSubmitForm);
router.post('/getStudentsForSecondaryScreening', getStudentsForSecondaryScreening);

router.post('/getPrimaryTestedCountStudentsBySchool', primaryTestedCountStudentsBySchool);
router.post('/getTotalStudentsBySchool' , getTotalStudentsBySchool);
router.post('/getSecondaryTestedCountStudentsBySchool', getSecondaryTestedCountStudentsBySchool);
// router.post('/getRemainingCountStudentsBySchool', remainingCountStudentsBySchool);




export default router;