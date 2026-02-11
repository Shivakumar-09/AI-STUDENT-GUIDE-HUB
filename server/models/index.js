const sequelize = require('../config/database');
const User = require('./User');
const QuizScore = require('./QuizScore');
const Leaderboard = require('./Leaderboard');

// Associations
User.hasMany(QuizScore, { onDelete: 'CASCADE' });
QuizScore.belongsTo(User);

module.exports = {
    sequelize,
    User,
    QuizScore,
    Leaderboard
};
