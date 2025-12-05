const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController");
const auth = require("../middlewares/authMiddleware");

router.get("/public/recent", announcementController.getRecentAnnouncements);
router.get("/public/:id", announcementController.getAnnouncement);

router.use(auth.protect);

router.get("/", announcementController.getAnnouncements);
router.get("/dashboard", announcementController.getDashboardAnnouncements);
router.get("/stats", announcementController.getAnnouncementStats);
router.get("/:id", announcementController.getAnnouncement);

router.post("/",auth.restrictTo('admin'), announcementController.createAnnouncement);
router.put("/:id", auth.restrictTo('admin'), announcementController.updateAnnouncement);
router.delete("/:id",auth.restrictTo('admin'), announcementController.deleteAnnouncement);

module.exports = router;