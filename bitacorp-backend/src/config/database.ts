import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bitacorp_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const testConnection = async (): Promise<void> => {
    try {
        const connection = await db.getConnection();
        console.log(' Conexión a la base de datos Bitacorp establecida con éxito.');
        connection.release();
        } catch (error) {
        console.error(' Error al conectar a la base de datos:', error);
    }
};

export default db;