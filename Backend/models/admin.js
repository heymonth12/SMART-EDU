import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Admin = sequelize.define(
    "admin",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        
        contact: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
    },
    {
        tableName: "admin",
        timestamps: true,
    }
);

export default Admin;
