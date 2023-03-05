const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

dotenv.config();

mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  console.log("Connected to mongo");
});

//middleware

app.use(express.json());

app.use(helmet());

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File Uploaded");
  } catch (err) {
    console.log(err);
  }
});

app.listen(8800, () => {
  console.log("Backend running");
});
