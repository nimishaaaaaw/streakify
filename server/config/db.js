const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

mongoose.connection.once("open", async () => {
  const indexes = await mongoose.connection.db
    .collection("habitlogs")
    .indexes();

  console.log("HabitLog indexes:", indexes);
});
