import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const SECRET_KEY = 'brevita-secret-key-2024';

// Helper to normalize phone number
const normalizePhone = (phone) => {
    if (!phone) return '';
    return String(phone).replace(/[^\d+]/g, '').trim();
};

router.post('/register', async (req, res) => {
    let { name, phone } = req.body;
    name = (name || '').trim();
    phone = normalizePhone(phone) || (phone || '').trim();

    if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const { db } = req;
    try {
        const existingUser = db.prepare('SELECT id, name, phone FROM users WHERE phone = ?').get(phone);
        
        if (existingUser) {
            // Update name if changed
            if (name && name !== existingUser.name) {
                db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, existingUser.id);
            }
            const user = { id: existingUser.id, name: name || existingUser.name, phone: existingUser.phone };
            const token = jwt.sign(user, SECRET_KEY, { expiresIn: '30d' });
            return res.json({ token, user });
        }

        const password_hash = await bcrypt.hash(phone, 10);
        const result = db.prepare('INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)').run(name, phone, password_hash);
        
        const user = { id: result.lastInsertRowid, name, phone };
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: '30d' });

        res.json({ token, user });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

router.post('/login', async (req, res) => {
    let { phone, name } = req.body;
    name = (name || '').trim();
    phone = normalizePhone(phone) || (phone || '').trim();

    if (!phone) {
        return res.status(400).json({ error: 'Mobile phone number is required' });
    }

    const { db } = req;
    try {
        let user = db.prepare('SELECT id, name, phone FROM users WHERE phone = ?').get(phone);
        
        if (!user) {
            // Auto-create user if not found
            const displayName = name || 'Brevita Guest';
            const password_hash = await bcrypt.hash(phone, 10);
            const result = db.prepare('INSERT INTO users (name, phone, password_hash) VALUES (?, ?, ?)').run(displayName, phone, password_hash);
            user = { id: result.lastInsertRowid, name: displayName, phone };
        } else if (name && name !== user.name) {
            db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, user.id);
            user.name = name;
        }

        const payload = { id: user.id, name: user.name, phone: user.phone };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30d' });

        res.json({ token, user: payload });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed. Please try again.' });
    }
});

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

export default router;
