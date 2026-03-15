require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('./models');

async function createAdmin() {
    try {
        await sequelize.sync();
        
        const email = 'admin@example.com';
        const password = 'adminpassword123';
        
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            console.log('Admin already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Admin.create({
            email,
            password: hashedPassword
        });

        console.log(`Admin created successfully! Email: ${email}, Password: ${password}`);
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        process.exit();
    }
}

createAdmin();
