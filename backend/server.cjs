const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database.cjs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Auth Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            // Fetch orders count
            db.all("SELECT * FROM orders WHERE user_email = ?", [email], (err, orders) => {
                res.json({
                    user: {
                        name: row.name,
                        email: row.email,
                        wallet: row.wallet,
                        orders: orders.length
                    }
                });
            });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    });
});

// Get Products
app.get('/api/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get Orders for User
app.get('/api/orders', (req, res) => {
    const { email } = req.query;
    db.all("SELECT * FROM orders WHERE user_email = ?", [email], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create Order (Simplified)
app.post('/api/orders', (req, res) => {
    const { id, user_email, item_name, status, tailor, delivery_date, price } = req.body;
    const sql = `INSERT INTO orders (id, user_email, item_name, status, tailor, delivery_date, price) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, user_email, item_name, status, tailor, delivery_date, price], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order created", id: this.lastID });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
