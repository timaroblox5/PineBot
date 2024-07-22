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
      `${process.env.MONGODB_CONNECT}`,
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
      console.log("MongoDB disconnected. Attempting to reconnect...");
      setTimeout(() => {
        mongoose.connect(
          `${process.env.MONGODB_CONNECT}`,
          dbOptions
        ).catch(err => {
          console.error("Reconnection attempt failed:", err);
        });
      }, 5000); // Пауза перед попыткой переподключения
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
//.