const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const multer = require("multer"); // ✅ Add this
const { dbConnection } = require("./db/dbConn");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const contentRoutes = require("./routes/content.routes");
// calling database 
dbConnection();

// cors 
const allowedOrigins = [
  "http://localhost:3000",
  "https://puwakholaonehydro.com.np",
];
app.set("trust proxy", 1);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// cors 
app.use(cookieParser());
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files
app.use('/uploads', express.static('uploads'));

// ----------------------------------------------------


app.get("/", (req, res) => {
  res.send("API running 🐢");
});

// routes
app.use("/api", userRoutes);
app.use("/api/contents", contentRoutes);

//  Global error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false,
        error: 'File size cannot exceed 2MB' 
      });
    }
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
  next();
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${process.env.PORT}`);
  }
});