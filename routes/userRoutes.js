const express = require('express');
const { signup, login  ,getUserDetails } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/view',getUserDetails);
// router.post('/address/register', addAddress);
module.exports = router;
