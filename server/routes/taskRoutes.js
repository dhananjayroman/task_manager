const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

// Protect all routes in this file
router.use(protect);

router.route('/')
  .post(
    [
      body('title').notEmpty().withMessage('Task title is required'),
      validate
    ],
    createTask
  )
  .get(getTasks);

router.route('/:id')
  .put(
    [
      body('status').optional().isIn(['Pending', 'Completed']).withMessage('Invalid status'),
      validate
    ],
    updateTask
  )
  .delete(deleteTask);

module.exports = router;
