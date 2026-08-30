import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory exists
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(path.join(dbDir, 'brevita.db'));

// Read and execute schema
const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
db.exec(schema);

// Make db accessible globally or via app setup. We'll pass it via req
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    req.db = db;
    next();
});

// Import routes
import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import supportRoutes from './routes/support.js';

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/support', supportRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Brevita Server running on http://localhost:${PORT}`);
});
