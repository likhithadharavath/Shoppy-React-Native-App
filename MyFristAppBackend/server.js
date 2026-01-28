const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/auth", require("./routes/auth"));
app.get('/',(req ,res)=>{
    res.send("server is working")
})

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
