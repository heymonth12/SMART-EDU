import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const User = sequelize.define(
    "user", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM("admin", "faculty", "student"),
            allowNull: false
        },
    }, {
        tableName: "users",
        timestamps: true
    }
);

export default User;
