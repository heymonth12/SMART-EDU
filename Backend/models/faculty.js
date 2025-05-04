import {  DataTypes } from "sequelize";
import sequelize from "./index.js";

const Faculty = sequelize.define(
    "faculty",{
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
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
        email:{
            type:DataTypes.STRING,
            allowNull:false,
            validate: {
                isEmail: true, 
            },
        },
        phone:{
            type:DataTypes.BIGINT,
            allowNull:false,            
        },
        type:{
            type:DataTypes.ENUM('guest', 'permanent'),
            allowNull:false
        },
        post: {
            type: DataTypes.STRING,//hod ,director, tpo, librarian,
            allowNull: false
        }
    },
    {
        tableName:"faculty",
        timestamps:true
    }
);

export default Faculty;