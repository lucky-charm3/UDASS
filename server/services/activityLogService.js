const activityLogRepository = require('../repositories/activityLogRepository');

const getAllLogs = async (queryParams) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    action = '',
    status = '',
    userId = '',
    startDate = '',
    endDate = ''
  } = queryParams;

  const query = {};

  if (search) {
    query.$or = [
      { description: { $regex: search, $options: 'i' } },
      { action: { $regex: search, $options: 'i' } }
    ];
  }

  if (action) query.action = action;
  if (status) query.status = status;
  if (userId) query.userId = userId;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [logs, total, users] = await Promise.all([
    activityLogRepository.findLogs(query, skip, limitNum),
    activityLogRepository.countLogs(query),
    activityLogRepository.findUsersWithLogs() 
  ]);

  return {
    logs,
    users, 
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      itemsPerPage: limitNum
    }
  };
};

const clearOldLogs = async (adminUser, ip, userAgent) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const result = await activityLogRepository.deleteLogsOlderThan(thirtyDaysAgo);


  await activityLogRepository.createLog({
    userId: adminUser._id,
    action: 'CLEAR_LOGS',
    description: `Cleared ${result.deletedCount} logs older than 30 days`,
    status: 'success',
    ip: ip,
    userAgent: userAgent
  });

  return {
    deletedCount: result.deletedCount,
    message: `Cleared ${result.deletedCount} logs older than 30 days`
  };
};

module.exports = {
  getAllLogs,
  clearOldLogs
};