import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const SECRET_KEY = 'brevita-secret-key-2024';

router.post('/register', async (req, res) => {
    const { name, phone } = req.body;
    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
    }

    const { db } = req;
    try {
        const existingUser = db.prepare('SELECT id FROM users WHERE phone = ?').get(phone);
        if (existingUser) {
            return res.status(400).json({ error: 'Phone number already exists' });
        }

        const password_hash = await bcrypt.hash(phone, 10);
        const result = db.prepare('INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)').run(name, phone, password_hash);
        
        const user = { id: result.lastInsertRowid, name, phone };
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '7d' });

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    const { phone } = req.body;
    if (!phone) {
        return res.status(400).json({ error: 'Phone is required' });
    }

    const { db } = req;
    try {
        const user = db.prepare('SELECT id, name, phone, password_hash FROM users WHERE phone = ?').get(phone);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(phone, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = { id: user.id, name: user.name, phone: user.phone };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

        res.json({ token, user: payload });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

export default router;
