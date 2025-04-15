// routes/postalcodeRoutes.js
import express from 'express';
import {getCountries,getStates,getDistricts,getTaluks} from '../controllers/postalcodeControllers.js'

const router = express.Router();

router.post('/get-countries', getCountries);
router.post('/get-states', getStates);
router.post('/get-districts',getDistricts);
router.post('/get-taluks',getTaluks);

export default router;
