require("dotenv").config();

const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const photoRoutes = require("./routes/photoRoutes");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const express = require("express");
const app = express();

app.use(cors());
const PORT = 5000;

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/photos", photoRoutes);

const frontPath = path.join(__dirname, "../front/build");

if (process.env.NODE_ENV === "production" && fs.existsSync(frontPath)) {
  // Serve static files
  app.use(express.static(frontPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    const indexFile = path.join(frontPath, "index.html");
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      res.status(404).send("index.html not found");
    }
  });
}

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo connected"))
    .catch((err) => console.error(err));
} else {
  console.warn("MONGO_URI not set!");
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
