const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    year: {
        type: DataTypes.STRING
    },
    track: {
        type: DataTypes.STRING
    },
    skills: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    targetJobs: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    // Flattened progress for easier querying, or keep as JSON. keeping as JSON for simplicity in migration unless needed.
    // The original schema had a nested object. Sequelize supports JSONB on Postgres.
    progress: {
        type: DataTypes.JSON,
        defaultValue: {
            prog: 0,
            dsa: 0,
            web: 0,
            proj: 0,
            dbms: 0,
            interview: 0
        }
    }
}, {
    tableName: 'users' // Explicit table name
});

module.exports = User;
