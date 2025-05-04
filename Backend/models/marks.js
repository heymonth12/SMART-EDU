import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Marks = sequelize.define(
    "marks", {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        student_rollno: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        marks_obtained: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        maximum_marks: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        exam_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sub_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        tableName: "marks",
        timestamps: true
    }
);

export default Marks;
