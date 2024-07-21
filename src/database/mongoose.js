const mongoose = require("mongoose");
const config = require("../../config.json");
const User = require('../models/User');

module.exports = {
  init: () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4,
      dbName: 'PDBOT' // Specify your database name here
    };

    mongoose.connect(
      `mongodb+srv://BFFBOT:${process.env.MONGODB_PASSWORD}@bffbot.hr7tpgj.mongodb.net/?retryWrites=true&w=majority`,
      dbOptions
    )
    .then(() => console.log("Connected to MongoDB: PDBOT"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB:", err);
      process.exit(1); // Exit with error
    });

    mongoose.set("useFindAndModify", false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected.");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1); // Exit with error
    });
  },

  registerUser: async (userId, guildId) => {
    try {
      let user = await User.findOne({ userId, guildId });
      if (!user) {
        user = new User({ userId, guildId });
        await user.save();
        console.log(`New user registered: ${userId}`);
      }
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  }
};