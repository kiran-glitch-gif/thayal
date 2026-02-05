const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'thayal360.db');

const db = new sqlite3.Database('./backend/thayal360_v2.db', (err) => {
    if (err) {
        console.error('Error opening database', err);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      wallet REAL DEFAULT 0
    )`);

        // Products Table
        db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      price REAL,
      image TEXT,
      rating REAL
    )`);

        // Orders Table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_email TEXT,
      item_name TEXT,
      status TEXT,
      tailor TEXT,
      delivery_date TEXT,
      price REAL
    )`);

        // Seed User
        db.get("SELECT * FROM users WHERE email = ?", ['priya@example.com'], (err, row) => {
            if (!row) {
                db.run(`INSERT INTO users (name, email, password, wallet) VALUES (?, ?, ?, ?)`,
                    ['Priya', 'priya@example.com', '123456', 500]);
                console.log("Seeded default user.");
            }
        });

        // Seed Products
        db.get("SELECT count(*) as count FROM products", [], (err, row) => {
            if (row.count === 0) {
                const products = [
                    // WOMEN (10 Items)
                    { name: "Bridal Lehenga", category: "Women", price: 15000, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", rating: 4.8 },
                    { name: "Silk Saree Blouse", category: "Women", price: 1200, image: "https://images.unsplash.com/photo-1610189032971-d602b9e61266?w=500", rating: 4.5 },
                    { name: "Anarkali Suit", category: "Women", price: 4500, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500", rating: 4.7 },
                    { name: "Designer Gown", category: "Women", price: 8000, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500", rating: 4.6 },
                    { name: "Printed Kurti", category: "Women", price: 999, image: "https://images.unsplash.com/photo-1502758107931-1de850e50338?w=500", rating: 4.3 },
                    { name: "Chikankari Kurta", category: "Women", price: 2500, image: "https://images.unsplash.com/photo-1605218427368-35b8dd98c616?w=500", rating: 4.5 },
                    { name: "Party Wear Dress", category: "Women", price: 3500, image: "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=500", rating: 4.4 },
                    { name: "Velvet Lehenga", category: "Women", price: 12000, image: "https://images.unsplash.com/photo-1585850407137-b64eb119567c?w=500", rating: 4.9 },
                    { name: "Cotton Salwar", category: "Women", price: 1800, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", rating: 4.2 },
                    { name: "Embroidered Blouse", category: "Women", price: 1500, image: "https://images.unsplash.com/photo-1634543787768-45c110900eMc?w=500", rating: 4.6 },

                    // MEN (10 Items)
                    { name: "Classic Sherwani", category: "Men", price: 18000, image: "https://images.unsplash.com/photo-1622359556133-c80d8f78038c?w=500", rating: 4.9 },
                    { name: "Formal Blazer", category: "Men", price: 5500, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500", rating: 4.7 },
                    { name: "White Shirt", category: "Men", price: 1200, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", rating: 4.5 },
                    { name: "Nehru Jacket", category: "Men", price: 3000, image: "https://images.unsplash.com/photo-1550921471-da0c279c09c9?w=500", rating: 4.6 },
                    { name: "Kurta Pajama", category: "Men", price: 2500, image: "https://images.unsplash.com/photo-1606709623257-2ad0b0d61756?w=500", rating: 4.4 },
                    { name: "Wedding Suit", category: "Men", price: 12000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", rating: 4.8 },
                    { name: "Linen Shirt", category: "Men", price: 1500, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", rating: 4.3 },
                    { name: "Casual Trousers", category: "Men", price: 1800, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500", rating: 4.2 },
                    { name: "Silk Kurta", category: "Men", price: 3500, image: "https://images.unsplash.com/photo-1588636412140-5e3e2c34279b?w=500", rating: 4.6 },
                    { name: "Jodhpuri Suit", category: "Men", price: 8500, image: "https://images.unsplash.com/photo-1526658098099-2322cb20155b?w=500", rating: 4.8 },

                    // KIDS (10 Items)
                    { name: "Party Frock", category: "Kids", price: 2500, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500", rating: 4.7 },
                    { name: "Kids Sherwani", category: "Kids", price: 3500, image: "https://images.unsplash.com/photo-1616428787754-0b70d421d898?w=500", rating: 4.8 },
                    { name: "Cotton Pajama Set", category: "Kids", price: 900, image: "https://images.unsplash.com/photo-1519238804368-68f9a2e8c255?w=500", rating: 4.5 },
                    { name: "Denim Jacket", category: "Kids", price: 1500, image: "https://images.unsplash.com/photo-1574046714589-9bd176461993?w=500", rating: 4.6 },
                    { name: "Princess Gown", category: "Kids", price: 4000, image: "https://images.unsplash.com/photo-1621452773781-0f992ee61c60?w=500", rating: 4.9 },
                    { name: "Boys Kurta", category: "Kids", price: 1200, image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500", rating: 4.4 },
                    { name: "Summer Dress", category: "Kids", price: 800, image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500", rating: 4.3 },
                    { name: "Festive Lehenga", category: "Kids", price: 3000, image: "https://images.unsplash.com/photo-1628045620958-867c2957b8c8?w=500", rating: 4.8 },
                    { name: "Suit Set", category: "Kids", price: 2800, image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500", rating: 4.6 },
                    { name: "Casual T-Shirt", category: "Kids", price: 500, image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500", rating: 4.2 }
                ];
                const stmt = db.prepare("INSERT INTO products (name, category, price, image, rating) VALUES (?, ?, ?, ?, ?)");
                products.forEach(p => {
                    stmt.run(p.name, p.category, p.price, p.image, p.rating);
                });
                stmt.finalize();
                console.log("Seeded products.");
            }
        });

        // Seed Orders
        db.get("SELECT count(*) as count FROM orders", [], (err, row) => {
            if (row.count === 0) {
                db.run(`INSERT INTO orders (id, user_email, item_name, status, tailor, delivery_date, price) VALUES 
          ('#TH-8920', 'priya@example.com', 'Anarkali Suit', 'STITCHING', 'Rajesh K', 'Jan 30', 4500),
          ('#TH-8500', 'priya@example.com', 'Cotton Kurti', 'DELIVERED', 'Priya M', 'Jan 15', 850)
        `);
                console.log("Seeded orders.");
            }
        });
    });
}

module.exports = db;
