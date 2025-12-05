const express =require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan =require ("morgan");
const helmet =require ("helmet");
const rateLimit = require("express-rate-limit");
const dbConnect =require("./config/dbConnect.js");
const errorHandler =require ("./middlewares/errorHandler.js");
const authRoutes =require ("./routes/authRoutes.js");
const paymentRoutes =require ("./routes/paymentRoutes.js");
const adminRoutes =require( "./routes/studentRoutes.js");
const activityRoutes=require("./routes/activityLogRoutes.js")
const colors=require("colors");
const announcementRoutes = require("./routes/announcementRoutes");

dotenv.config();
dbConnect();

const app = express();

app.use(helmet());

app.use(cors({ 
  origin: process.env.CLIENT_URL,
  credentials: true ,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept"
    ],
  }));

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

app.use("/api/", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/students", adminRoutes);
app.use("/api/activityRoutes",activityRoutes);
app.use("/api/announcements", announcementRoutes);


app.get("/", (req, res) => {
  res.json({ message: "UDASS Membership API is running strong" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.blue.bold);
});