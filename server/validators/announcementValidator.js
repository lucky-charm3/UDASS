const Joi = require("joi");

const createAnnouncementSchema = Joi.object({
  title: Joi.string().required().max(200),
  content: Joi.string().required(),
  category: Joi.string().valid("general", "event", "payment", "emergency", "academic", "other").default("general"),
  priority: Joi.string().valid("low", "medium", "high", "urgent").default("medium"),
  expiresAt: Joi.date().iso().allow(null, ""), 
  tags: Joi.array().items(Joi.string()).default([]),
  attachments: Joi.array().default([])
});

const updateAnnouncementSchema = createAnnouncementSchema.fork(
  Object.keys(createAnnouncementSchema.describe().keys),
  (schema) => schema.optional()
);

const queryAnnouncementSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().allow(""),
  priority: Joi.string().allow(""),
  search: Joi.string().allow(""),
  sortBy: Joi.string().default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").default("desc"),
  isActive: Joi.boolean().optional() 
});

module.exports = {
  createAnnouncementSchema,
  updateAnnouncementSchema,
  queryAnnouncementSchema
};