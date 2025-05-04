import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Attendance = sequelize.define(
    "Attendance", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        student_rollno: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            // references: {
            //     model: "students", 
            //     key: "rollno"
            // }
        },
        student_name: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: "students", 
            //     key: "rollno"
            // }
        },
        subject_code: {
            type: DataTypes.STRING,
            allowNull: false,
            // references: {
            //     model: "subjects", 
            //     key: "code"
            // }
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM("absent", "present"),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY, 
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: "attendance",
        timestamps: true
    }
);

export default Attendance;
