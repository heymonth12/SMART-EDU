import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
const sequelize = new Sequelize('campusIQ', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});
try {
    await sequelize.authenticate();
    // console.log("Database connected successfully!");

    await sequelize.sync(); 
    // console.log("All models synchronized successfully!");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}
export default sequelize;
