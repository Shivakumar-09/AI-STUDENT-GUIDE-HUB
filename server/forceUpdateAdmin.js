require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Admin } = require('./models');

async function forceUpdateAdmin() {
    try {
        await sequelize.sync();
        const email = 'admin@example.com';
        const password = 'adminpassword123';
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [admin, created] = await Admin.findOrCreate({
            where: { email },
            defaults: { password: hashedPassword }
        });

        if (!created) {
            admin.password = hashedPassword;
            await admin.save();
            console.log("Updated existing admin password to adminpassword123");
        } else {
            console.log("Created new admin");
        }
        
    } catch(e) { console.error(e); }
    finally { process.exit(); }
}
forceUpdateAdmin();
