import mysql2  from 'mysql2/promise';



const config=process.env.MY_CONNECTION;
const pool=mysql2.createPool({
    config
})

const getConnection=async()=>{
    try {
        const connection=await pool.getConnection();
        return connection;
    } catch (error) {
        console.log(error);
    }
}

export default getConnection;