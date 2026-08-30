import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/messages', (req, res) => {
    const { db, user } = req;
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        db.prepare('INSERT INTO support_messages (user_id, message, sender) VALUES (?, ?, ?)').run(user.id, message, 'user');
        
        let reply = "Thank you for reaching out to Brevita Support. Our team will get back to you shortly.";
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('cancel')) {
            reply = "To cancel an order, navigate to your Orders history and click 'Cancel' on the specific order if it's still in 'confirmed' status.";
        } else if (lowerMsg.includes('track')) {
            reply = "You can track your order status in the Orders section of your profile.";
        } else if (lowerMsg.includes('modify')) {
            reply = "Currently, orders cannot be modified after they are placed. You may cancel it if eligible and place a new order.";
        }
        
        db.prepare('INSERT INTO support_messages (user_id, message, sender) VALUES (?, ?, ?)').run(user.id, reply, 'bot');
        
        res.json({
            userMessage: message,
            botReply: reply
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process message' });
    }
});

router.get('/messages', (req, res) => {
    const { db, user } = req;
    try {
        const msgs = db.prepare('SELECT * FROM support_messages WHERE user_id = ? ORDER BY created_at ASC').all(user.id);
        res.json(msgs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

export default router;
