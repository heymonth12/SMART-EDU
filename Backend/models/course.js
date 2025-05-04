import { DataTypes } from "sequelize";
import sequelize from "./index.js";


//name , duration , fees , subjects 
const Course = sequelize.define(
    "Course",
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        duration: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[0-9]+ (month|year|months|years)$/i 
             }
        },

        fees: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        subjects: {
            type: DataTypes.JSON, 
            allowNull: false
        }
    },
    {
        tableName: "course",
        timestamps: true
    }
);

export default Course;
