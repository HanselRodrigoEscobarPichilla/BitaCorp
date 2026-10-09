import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_mega_ultra_supremo_seguro_bitacorp';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Acceso denegado. Token no provisto.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: 'Token inválido o expirado.' });
    }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;
        const role = user?.role ? String(user.role).toUpperCase() : '';
        if (!user || !allowedRoles.some((r) => r.toUpperCase() === role)) {
            res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción.' });
            return;
        }
        next();
    };
};