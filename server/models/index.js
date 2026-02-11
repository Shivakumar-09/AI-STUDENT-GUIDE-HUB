const sequelize = require('../config/database');
const User = require('./User');
const Leaderboard = require('./Leaderboard');

// Associations

module.exports = {
    sequelize,
    User,
    Leaderboard
};
