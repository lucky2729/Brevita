import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
    const { db, user } = req;
    try {
        const items = db.prepare(`
            SELECT c.id as cart_item_id, c.quantity, m.* 
            FROM cart_items c
            JOIN menu_items m ON c.item_id = m.id
            WHERE c.user_id = ?
        `).all(user.id);
        
        const mappedItems = items.map(item => ({
            id: item.cart_item_id,
            itemId: item.id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            dietary: item.dietary || 'veg',
            emoji: item.emoji,
            image: item.image,
            calories: item.calories
        }));
        res.json({ items: mappedItems });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

router.post('/', (req, res) => {
    const { db, user } = req;
    const { itemId, quantity = 1 } = req.body;
    
    try {
        const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND item_id = ?').get(user.id, itemId);
        
        if (existing) {
            db.prepare('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?').run(quantity, existing.id);
        } else {
            db.prepare('INSERT INTO cart_items (user_id, item_id, quantity) VALUES (?, ?, ?)').run(user.id, itemId, quantity);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
});

router.put('/:id', (req, res) => {
    const { db, user } = req;
    const { id } = req.params;
    const { quantity } = req.body;
    
    try {
        if (quantity <= 0) {
            db.prepare('DELETE FROM cart_items WHERE (id = ? OR item_id = ?) AND user_id = ?').run(id, id, user.id);
        } else {
            db.prepare('UPDATE cart_items SET quantity = ? WHERE (id = ? OR item_id = ?) AND user_id = ?').run(quantity, id, id, user.id);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart' });
    }
});

router.delete('/:id', (req, res) => {
    const { db, user } = req;
    const { id } = req.params;
    
    try {
        db.prepare('DELETE FROM cart_items WHERE (id = ? OR item_id = ?) AND user_id = ?').run(id, id, user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete cart item' });
    }
});

router.delete('/', (req, res) => {
    const { db, user } = req;
    try {
        db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

router.get('/suggestions', (req, res) => {
    const { db, user } = req;
    try {
        const cartItems = db.prepare(`
            SELECT m.id, m.pairs_with 
            FROM cart_items c
            JOIN menu_items m ON c.item_id = m.id
            WHERE c.user_id = ?
        `).all(user.id);
        
        const cartItemIds = new Set(cartItems.map(c => c.id));
        let suggestedIds = new Set();
        
        cartItems.forEach(item => {
            const pairs = JSON.parse(item.pairs_with);
            pairs.forEach(p => {
                if (!cartItemIds.has(p)) {
                    suggestedIds.add(p);
                }
            });
        });
        
        let arr = Array.from(suggestedIds).slice(0, 4);
        if (arr.length === 0) {
            return res.json([]);
        }
        
        const placeholders = arr.map(() => '?').join(',');
        const suggestions = db.prepare(`SELECT * FROM menu_items WHERE id IN (${placeholders})`).all(...arr);
        
        res.json(suggestions.map(s => ({
            ...s,
            ingredients: JSON.parse(s.ingredients),
            tags: JSON.parse(s.tags),
            pairs_with: JSON.parse(s.pairs_with)
        })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

export default router;
