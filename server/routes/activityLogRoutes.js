const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect); 
router.use(restrictTo('admin'));

router.get('/activity-logs', activityLogController.getActivityLogs);
router.delete('/activity-logs/clear', activityLogController.clearOldLogs);

module.exports = router;