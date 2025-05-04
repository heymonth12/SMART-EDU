import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Student = sequelize.define(
    "student", {
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
            allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        phone: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        roll_number: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        course: {
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
        campus:{
            type: DataTypes.STRING,
            allowNull: false
        },
        year_of_admission: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "student",
        timestamps: true
    }
);

export default Student;
