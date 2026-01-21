const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const flatRoutes = require("./routes/flatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "FlatFinder API is running 🚀" });
});

app.use("/users", userRoutes);

app.use("/flats", flatRoutes);

app.use("/flats", messageRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;
