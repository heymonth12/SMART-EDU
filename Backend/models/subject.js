import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Subject = sequelize.define(
    "subject", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        tableName: "subject",
        timestamps: true
    }
);

export default Subject;
