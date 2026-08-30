import express from 'express';

const router = express.Router();

const parseItem = (item) => ({
    ...item,
    ingredients: JSON.parse(item.ingredients),
    tags: JSON.parse(item.tags),
    pairs_with: JSON.parse(item.pairs_with)
});

router.get('/', (req, res) => {
    const { category } = req.query;
    const { db } = req;

    try {
        let items;
        if (category) {
            items = db.prepare('SELECT * FROM menu_items WHERE category = ?').all(category);
        } else {
            items = db.prepare('SELECT * FROM menu_items').all();
        }
        res.json(items.map(parseItem));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const { db } = req;

    try {
        const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(parseItem(item));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch item' });
    }
});

router.get('/:id/pairings', (req, res) => {
    const { id } = req.params;
    const { db } = req;

    try {
        const item = db.prepare('SELECT pairs_with FROM menu_items WHERE id = ?').get(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const pairingsIds = JSON.parse(item.pairs_with);
        if (pairingsIds.length === 0) {
            return res.json([]);
        }

        const placeholders = pairingsIds.map(() => '?').join(',');
        const pairings = db.prepare(`SELECT * FROM menu_items WHERE id IN (${placeholders})`).all(...pairingsIds);
        
        res.json(pairings.map(parseItem));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pairings' });
    }
});

export default router;
