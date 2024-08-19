const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    guildId: { type: String, required: true },
    xp: { type: Number, default: 0 },
    rank: { type: Number, default: 1 },
});

module.exports = mongoose.model('User', userSchema);
