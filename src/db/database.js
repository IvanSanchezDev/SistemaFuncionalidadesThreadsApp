import mysql from "mysql2";
import dotenv from 'dotenv'

dotenv.config();





const connection =  mysql.createPool({
    host: process.env.HOSTNAME,
    user:process.env.NAME_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

const getConnection = () => {
    return connection;
};



export default getConnection;