const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.post('/', createUser); // Allowing public user creation for now, or could protect it too

module.exports = router;
