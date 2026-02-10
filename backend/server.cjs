import { useState, useEffect } from 'react';
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database.cjs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = 5000;
const JWT_SECRET = 'thayal360_secret_key_2026';

app.use(cors());
app.use(bodyParser.json());

// Real-time connections
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_order', (orderId) => {
        socket.join(orderId);
        console.log(`User joined order room: ${orderId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Auth: Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO users (name, email, password, wallet) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, 0],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: "Email already exists" });
                    }
                    return res.status(500).json({ error: err.message });
                }
                const token = jwt.sign({ email, name }, JWT_SECRET, { expiresIn: '24h' });
                res.json({
                    token,
                    user: { name, email, wallet: 0, orders: 0 }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Auth: Login
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(401).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, row.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        // Fetch orders count
        db.all("SELECT * FROM orders WHERE user_email = ?", [email], (err, orders) => {
            const token = jwt.sign({ email: row.email, name: row.name }, JWT_SECRET, { expiresIn: '24h' });
            res.json({
                token,
                user: {
                    name: row.name,
                    email: row.email,
                    wallet: row.wallet,
                    orders: orders ? orders.length : 0
                }
            });
        });
    });
});

// Middleware to verify JWT (for future protected routes)
const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Unauthorized" });
        req.user = decoded;
        next();
    });
};

// Get Products (No change needed)
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

// Create Order (Broadcasting to Admin)
app.post('/api/orders', (req, res) => {
    const { id, user_email, item_name, status, tailor, delivery_date, price } = req.body;
    const sql = `INSERT INTO orders (id, user_email, item_name, status, tailor, delivery_date, price) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, user_email, item_name, status, tailor, delivery_date, price], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Notify admin of new order
        io.emit('new_order', { id, user_email, item_name, price });

        res.json({ message: "Order created", id: this.lastID });
    });
});

// Admin: Get All Orders
app.get('/api/admin/orders', (req, res) => {
    db.all("SELECT * FROM orders ORDER BY rowid DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: Update Order Status (Broadcasting to User)
app.put('/api/admin/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Notify specific order room of status update
        io.to(id).emit('order_status_update', { id, status });

        res.json({ message: "Status updated successfully" });
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


