const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizScore = sequelize.define('QuizScore', {
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'quiz_scores'
});

module.exports = QuizScore;
