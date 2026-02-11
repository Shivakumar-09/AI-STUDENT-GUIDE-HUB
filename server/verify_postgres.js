require('dotenv').config();
const { sequelize, User, Leaderboard } = require('./models');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync models
        await sequelize.sync({ force: false }); // force: false to avoid dropping tables if they exist
        console.log('All models were synchronized successfully.');

        // Verify User model
        const userCount = await User.count();
        console.log(`Current user count: ${userCount}`);

        // Verify Leaderboard model
        const leaderboardCount = await Leaderboard.count();
        console.log(`Current leaderboard count: ${leaderboardCount}`);

        console.log('Verification complete!');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

testConnection();
