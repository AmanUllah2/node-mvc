const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGO_URI =
    "mongodb+srv://aman075:yejVawlNhNeLRnm1@cluster0.n52qtdl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection error ❌", error);
    process.exit(1);
  }
};

module.exports = connectDB;
