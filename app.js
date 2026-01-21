// app.js
const express = require("express");
const cors = require("cors");

// Rotas (vamos criar os arquivos já já)
const userRoutes = require("./routes/userRoutes");
const flatRoutes = require("./routes/flatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Allow frontend to access API
app.use(cors());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "FlatFinder API is running 🚀" });
});

// Attach main routers (ainda serão implementadas)
app.use("/users", userRoutes);
app.use("/flats", flatRoutes);
app.use("/flats", messageRoutes); // ex: /flats/:id/messages

module.exports = app;
