import express, { Application } from 'express';
import dotenv from 'dotenv';
import db, { testConnection } from './config/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

testConnection();

app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://127.0.0.1:${PORT}`);
});