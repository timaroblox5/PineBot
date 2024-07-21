const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    bffPoints: { type: Number, default: 0 }, // Default currency (BFF points)
});

module.exports = mongoose.model('User', userSchema);
