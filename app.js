const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const flatRoutes = require("./routes/flatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(express.json());


app.use(cors());


app.use("/users", userRoutes);
app.use("/flats", flatRoutes);
app.use("/flats", messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "FlatFinder API is running 🚀" });
});


app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
});

module.exports = app;
