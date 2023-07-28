
import mysql from "promise-mysql";
import dotenv from 'dotenv'

dotenv.config();

const connection = mysql.createConnection({
    host:process.env.HOST,
    database:process.env.DATABASE,
    user:process.env.NAME_USER,
    password:process.env.PASSWORD
});

const getConnection = () => {
    return connection;
};


export default getConnection;