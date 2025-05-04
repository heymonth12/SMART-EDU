import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Assignment = sequelize.define(
    "assignment", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postedBy: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        deadline: {
            type: DataTypes.DATE,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        campus: {
            type: DataTypes.STRING,
            allowNull: false
        },
        semester: {
            type: DataTypes.STRING,
            allowNull: false
        },
        section: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: "assignment",
        timestamps: true
    }
);

export default Assignment;
