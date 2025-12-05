const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ["general", "event", "payment", "emergency", "academic", "other"],
    default: "general"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: function() {
      const date = new Date();
      date.setDate(date.getDate() + 30); 
      return date;
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    mimetype: String
  }],
  views: {
    type: Number,
    default: 0
  },
  notifiedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

announcementSchema.index({ isActive: 1, publishedAt: -1 });
announcementSchema.index({ category: 1, priority: -1 });
announcementSchema.index({ expiresAt: 1 });
announcementSchema.index({ tags: 1 });

announcementSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

announcementSchema.virtual('isNew').get(function() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.publishedAt > twentyFourHoursAgo;
});

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;