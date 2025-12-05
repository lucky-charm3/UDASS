const ActivityLog = require('../models/activityLog');
const User = require('../models/studentModel'); 

const findLogs = async (query, skip, limit) => {
  return await ActivityLog.find(query)
    .populate('userId', 'fullName regNumber email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countLogs = async (query) => {
  return await ActivityLog.countDocuments(query);
};

const deleteLogsOlderThan = async (date) => {
  return await ActivityLog.deleteMany({
    createdAt: { $lt: date }
  });
};

const createLog = async (logData) => {
  return await ActivityLog.create(logData);
};

const findUsersWithLogs = async () => {
  const userIds = await ActivityLog.distinct('userId');
  return await User.find({ _id: { $in: userIds } })
    .select('fullName regNumber email')
    .sort({ fullName: 1 });
};

module.exports = {
  findLogs,
  countLogs,
  deleteLogsOlderThan,
  createLog,
  findUsersWithLogs
};