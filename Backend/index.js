const express = require("express");
const app = express();

const userRoutes = require("./routes/User.routes");
const profileRoutes = require("./routes/Profile.routes");
const paymentRoutes = require("./routes/Payments.routes");
const courseRoutes = require("./routes/Course.routes");

const database = require("./configs/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./configs/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 4000;

database.connect();
// middleware
app.use(express.json());
app.use(cookieParser);
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp" }));

// Cloudinary Connection
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Default routes
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
})