const activityLogService = require('../services/activityLogService');
const asyncHandler = require('../middlewares/asyncHandler'); 

const getActivityLogs = asyncHandler(async (req, res) => {
  const result = await activityLogService.getAllLogs(req.query);
  
  res.status(200).json({
    success: true,
    data: result
  });
});

const clearOldLogs = asyncHandler(async (req, res) => {
  const result = await activityLogService.clearOldLogs(
    req.user, 
    req.ip, 
    req.headers['user-agent']
  );

  res.status(200).json({
    success: true,
    message: result.message,
    data: result
  });
});

module.exports = {
  getActivityLogs,
  clearOldLogs
};