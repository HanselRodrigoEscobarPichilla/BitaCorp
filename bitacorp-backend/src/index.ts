import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db, { testConnection } from './config/database';
import path from 'path';
import authRouter from './router/authRouter';
import binnacleRouter from './router/binnacleRouter';
import usersRouter from './router/usersRouter';
import { verifyToken } from './middleware/authMiddleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/auth', authRouter);
app.use('/api/binnacles', verifyToken, binnacleRouter);
app.use('/api/users', verifyToken, usersRouter);

testConnection();

app.listen(PORT, () => {
    console.log(` Servidor corriendo en http://127.0.0.1:${PORT}`);
});

export default app;
