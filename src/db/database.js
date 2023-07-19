import mysql2  from 'mysql2/promise';

import dotenv from 'dotenv'

dotenv.config();

const info=process.env.MY_CONNECTION;
const pool=mysql2.createPool({
    host: process.env.HOSTNAME,
    user: process.env.NAME_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

const getConnection=async()=>{
    try {
        const connection=await pool.getConnection();
        return connection;
    } catch (error) {
        console.log(error.message);
    }
}

export default getConnection;