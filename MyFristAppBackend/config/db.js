const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://likhithad_db_user:133a9oIXilrtYjrL@cluster0.6pbf2vo.mongodb.net/shoppyDB?retryWrites=true&w=majority"
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
