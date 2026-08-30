import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', (req, res) => {
    const { db, user } = req;
    const { type, paymentMethod } = req.body;
    
    if (!['dine-in', 'takeaway'].includes(type) || !['card', 'upi', 'cash'].includes(paymentMethod)) {
        return res.status(400).json({ error: 'Invalid order type or payment method' });
    }

    try {
        db.transaction(() => {
            const cartItems = db.prepare(`
                SELECT c.quantity, m.id, m.name, m.price, m.emoji 
                FROM cart_items c
                JOIN menu_items m ON c.item_id = m.id
                WHERE c.user_id = ?
            `).all(user.id);

            if (cartItems.length === 0) {
                throw new Error('Cart is empty');
            }

            let subtotal = 0;
            cartItems.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const cgst = subtotal * 0.09;
            const sgst = subtotal * 0.09;
            const total = subtotal + cgst + sgst;

            const orderNumber = 'BRV-' + Math.floor(10000 + Math.random() * 90000);

            const stmt = db.prepare(`
                INSERT INTO orders (user_id, order_number, items, subtotal, cgst, sgst, total, type, payment_method, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                user.id,
                orderNumber,
                JSON.stringify(cartItems),
                subtotal,
                cgst,
                sgst,
                total,
                type,
                paymentMethod,
                'confirmed'
            );

            db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id);
            
            res.json({ 
                success: true, 
                orderId: result.lastInsertRowid,
                orderNumber,
                total 
            });
        })();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/', (req, res) => {
    const { db, user } = req;
    try {
        const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(user.id);
        res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

router.get('/:id', (req, res) => {
    const { db, user } = req;
    const { id } = req.params;
    try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(id, user.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ ...order, items: JSON.parse(order.items) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

router.put('/:id/cancel', (req, res) => {
    const { db, user } = req;
    const { id } = req.params;
    try {
        const order = db.prepare('SELECT status FROM orders WHERE id = ? AND user_id = ?').get(id, user.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        if (order.status !== 'confirmed') return res.status(400).json({ error: 'Only confirmed orders can be cancelled' });
        
        db.prepare('UPDATE orders SET status = ? WHERE id = ? AND user_id = ?').run('cancelled', id, user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

export default router;
