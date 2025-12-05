const Announcement = require("../models/Announcement");

const createAnnouncement = async (announcementData) => {
  const announcement = new Announcement(announcementData);
  return await announcement.save();
};

const findAllAnnouncements = async ({
  page = 1,
  limit = 10,
  category,
  priority,
  isActive = true,
  search,
  sortBy = 'publishedAt',
  sortOrder = 'desc',
  userId = null
}) => {
  const query = { isActive };

  if (category) query.category = category;
  if (priority) query.priority = priority;
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } }
    ];
  }

  query.expiresAt = { $gt: new Date() };

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [announcements, total] = await Promise.all([
    Announcement.find(query)
      .populate('createdBy', 'fullName regNumber email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Announcement.countDocuments(query)
  ]);

  if (userId) {
    await Promise.all(
      announcements.map(async (announcement) => {
        if (!announcement.notifiedUsers.includes(userId)) {
          await Announcement.updateOne(
            { _id: announcement._id },
            { 
              $inc: { views: 1 },
              $addToSet: { notifiedUsers: userId }
            }
          );
        }
      })
    );
  }

  return {
    announcements,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
};

const findAnnouncementById = async (id, incrementView = false) => {
  const announcement = await Announcement.findById(id)
    .populate('createdBy', 'fullName regNumber email profilePicture')
    .lean();

  if (announcement && incrementView) {
    await Announcement.updateOne(
      { _id: id },
      { $inc: { views: 1 } }
    );
    announcement.views += 1;
  }

  return announcement;
};

const updateAnnouncement = async (id, updateData) => {
  return await Announcement.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('createdBy', 'fullName regNumber email');
};

const deleteAnnouncement = async (id) => {
  return await Announcement.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};

const getAnnouncementStats = async () => {
  const stats = await Announcement.aggregate([
    {
      $match: {
        isActive: true,
        expiresAt: { $gt: new Date() }
      }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        urgent: {
          $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        urgent: 1,
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);

  const total = await Announcement.countDocuments({
    isActive: true,
    expiresAt: { $gt: new Date() }
  });

  return { stats, total };
};

const getRecentAnnouncements = async (limit = 5) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  return await Announcement.find({
    isActive: true,
    publishedAt: { $gte: sevenDaysAgo },
    expiresAt: { $gt: new Date() }
  })
  .populate('createdBy', 'fullName')
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

const getDashboardAnnouncements = async (userId, isAdmin = false, limit = 10) => {
  const query = {
    isActive: true,
    expiresAt: { $gt: new Date() }
  };

  if (!isAdmin) {
    query.notifiedUsers = { $ne: userId };
  }

  return await Announcement.find(query)
    .populate('createdBy', 'fullName')
    .sort({
      priority: -1,
      publishedAt: -1
    })
    .limit(limit)
    .lean();
};

const updateExpiredAnnouncements = async () => {
  return await Announcement.updateMany(
    {
      expiresAt: { $lte: new Date() },
      isActive: true
    },
    { isActive: false }
  );
};

module.exports = {
  createAnnouncement,
  findAllAnnouncements,
  findAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  getRecentAnnouncements,
  getDashboardAnnouncements,
  updateExpiredAnnouncements
};