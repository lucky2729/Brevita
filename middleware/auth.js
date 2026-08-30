import jwt from 'jsonwebtoken';

const SECRET_KEY = 'brevita-secret-key-2024';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = {
            id: decoded.id,
            name: decoded.name,
            phone: decoded.phone
        };
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
