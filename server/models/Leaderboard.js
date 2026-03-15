const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Leaderboard = sequelize.define('Leaderboard', {
    name: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'leaderboard'
});

module.exports = Leaderboard;
