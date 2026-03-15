const sequelize = require('../config/database');
const User = require('./User');
const Leaderboard = require('./Leaderboard');
const Admin = require('./Admin');

// Associations

module.exports = {
    sequelize,
    User,
    Leaderboard,
    Admin
};
