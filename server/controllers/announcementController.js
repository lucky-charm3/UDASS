const announcementRepository = require("../repositories/announcementRepository");
const logActivity = require("../repositories/activityLogRepository");
const { 
  createAnnouncementSchema, 
  updateAnnouncementSchema,
  queryAnnouncementSchema 
} = require("../validators/announcementValidator");

const createAnnouncement = async (req, res) => {
  try {
    const { error, value } = createAnnouncementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const announcementData = {
      ...value,
      createdBy: req.user._id
    };

    const announcement = await announcementRepository.createAnnouncement(announcementData);

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement
    });
  } 
  catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { error, value } = queryAnnouncementSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const userId = req.user?._id;
    const isActive = req.user?.role === 'admin' ? value.isActive : true;

    const result = await announcementRepository.findAllAnnouncements({
      ...value,
      isActive,
      userId
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcements"
    });
  }
};

const getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const incrementView = req.query.incrementView === 'true';

    const announcement = await announcementRepository.findAnnouncementById(id, incrementView);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcement"
    });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingAnnouncement = await announcementRepository.findAnnouncementById(id);
    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    if (existingAnnouncement.createdBy._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this announcement"
      });
    }

    const { error, value } = updateAnnouncementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    const updatedAnnouncement = await announcementRepository.updateAnnouncement(id, value);

    res.json({
      success: true,
      message: "Announcement updated successfully",
      data: updatedAnnouncement
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update announcement"
    });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAnnouncement = await announcementRepository.findAnnouncementById(id);
    if (!existingAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found"
      });
    }

    if (existingAnnouncement.createdBy._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this announcement"
      });
    }

    const deletedAnnouncement = await announcementRepository.deleteAnnouncement(id);

    res.json({
      success: true,
      message: "Announcement deleted successfully",
      data: deletedAnnouncement
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete announcement"
    });
  }
};

const getAnnouncementStats = async (req, res) => {
  try {
    const stats = await announcementRepository.getAnnouncementStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Error fetching announcement stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch announcement statistics"
    });
  }
};

const getDashboardAnnouncements = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const limit = parseInt(req.query.limit) || 10;
    
    const announcements = await announcementRepository.getDashboardAnnouncements(
      req.user._id, 
      isAdmin,
      limit
    );

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error("Error fetching dashboard announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard announcements"
    });
  }
};

const getRecentAnnouncements = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const announcements = await announcementRepository.getRecentAnnouncements(limit);

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error("Error fetching recent announcements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent announcements"
    });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  getDashboardAnnouncements,
  getRecentAnnouncements
};