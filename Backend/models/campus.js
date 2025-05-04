import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Campus = sequelize.define(
    "Campus", // Model name
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course: {
            type: DataTypes.JSON,
            allowNull: false,
            
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "campus", 
        timestamps: true,
    }
);

export default Campus;