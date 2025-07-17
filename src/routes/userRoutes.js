const express = require('express');
const { registerUser, loginUser,updateUser } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:username', updateUser)
module.exports = router;