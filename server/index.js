require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const photoRoutes = require("./routes/photoRoutes");
const path = require("path")

const app = express();


const originalUse = app.use;
app.use = function (path, ...handlers) {
  console.log(" app.use registering path:", path);
  return originalUse.call(this, path, ...handlers);
};

app.use(cors());
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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontPath, "index.html"));
  });
}


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`)); 