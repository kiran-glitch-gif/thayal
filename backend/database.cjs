const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'thayal360_v3.db');
const db = new sqlite3.Database(dbPath, (err) => {
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
                    // WOMEN (15 Items)
                    { name: "Royal Bridal Lehenga", category: "Women", price: 25000, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", rating: 4.9 },
                    { name: "Silk Saree Blouse", category: "Women", price: 1200, image: "https://images.unsplash.com/photo-1610189032971-d602b9e61266?w=500", rating: 4.5 },
                    { name: "Anarkali Suit Set", category: "Women", price: 4500, image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500", rating: 4.7 },
                    { name: "Designer Evening Gown", category: "Women", price: 8500, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500", rating: 4.6 },
                    { name: "Printed Floral Kurti", category: "Women", price: 899, image: "https://images.unsplash.com/photo-1502758107931-1de850e50338?w=500", rating: 4.3 },
                    { name: "Chikankari White Kurta", category: "Women", price: 2800, image: "https://images.unsplash.com/photo-1605218427368-35b8dd98c616?w=500", rating: 4.5 },
                    { name: "Party Wear Indo-Western", category: "Women", price: 3800, image: "https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?w=500", rating: 4.4 },
                    { name: "Deep Red Velvet Lehenga", category: "Women", price: 18000, image: "https://images.unsplash.com/photo-1585850407137-b64eb119567c?w=500", rating: 4.9 },
                    { name: "Cotton Salwar Kameez", category: "Women", price: 1800, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", rating: 4.2 },
                    { name: "Zari Embroidered Blouse", category: "Women", price: 2200, image: "https://images.unsplash.com/photo-1634543787768-45c110900eMc?w=500", rating: 4.6 },
                    { name: "Handwoven Banarasi Saree", category: "Women", price: 12000, image: "https://images.unsplash.com/photo-1610189012903-8889bd8c1143?w=500", rating: 4.8 },
                    { name: "Plazzo Suit Set", category: "Women", price: 3200, image: "https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?w=500", rating: 4.4 },
                    { name: "Organza Party Dress", category: "Women", price: 5500, image: "https://images.unsplash.com/photo-1572804013307-a9a111dc0308?w=500", rating: 4.5 },
                    { name: "Short Designer Kurti", category: "Women", price: 1100, image: "https://images.unsplash.com/photo-1598501022234-54730a76d3fc?w=500", rating: 4.3 },
                    { name: "Net Embroidered Saree", category: "Women", price: 6800, image: "https://images.unsplash.com/photo-1583391733975-ce4018a666ad?w=500", rating: 4.7 },

                    // MEN (12 Items)
                    { name: "Premium Wedding Sherwani", category: "Men", price: 22000, image: "https://images.unsplash.com/photo-1622359556133-c80d8f78038c?w=500", rating: 4.9 },
                    { name: "Italian Cut Formal Blazer", category: "Men", price: 7500, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500", rating: 4.7 },
                    { name: "Oxford White Formal Shirt", category: "Men", price: 1500, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", rating: 4.5 },
                    { name: "Modi Style Nehru Jacket", category: "Men", price: 3200, image: "https://images.unsplash.com/photo-1550921471-da0c279c09c9?w=500", rating: 4.6 },
                    { name: "Cotton Kurta Pajama", category: "Men", price: 2200, image: "https://images.unsplash.com/photo-1606709623257-2ad0b0d61756?w=500", rating: 4.4 },
                    { name: "Bespoke 3-Piece Suit", category: "Men", price: 15000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500", rating: 4.8 },
                    { name: "Pure Linen Summer Shirt", category: "Men", price: 1800, image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", rating: 4.3 },
                    { name: "Slim Fit Chinos", category: "Men", price: 2100, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500", rating: 4.2 },
                    { name: "Raw Silk Ethnic Kurta", category: "Men", price: 4200, image: "https://images.unsplash.com/photo-1588636412140-5e3e2c34279b?w=500", rating: 4.6 },
                    { name: "Traditional Jodhpuri Set", category: "Men", price: 9500, image: "https://images.unsplash.com/photo-1526658098099-2322cb20155b?w=500", rating: 4.8 },
                    { name: "Designer Waistcoat", category: "Men", price: 2800, image: "https://images.unsplash.com/photo-1617130863154-964ff3b456bd?w=500", rating: 4.5 },
                    { name: "Velvet Bandhgala", category: "Men", price: 11000, image: "https://images.unsplash.com/photo-1605518295077-5c2f3775f0f3?w=500", rating: 4.7 },

                    // KIDS (10 Items)
                    { name: "Floral Party Frock", category: "Kids", price: 2200, image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500", rating: 4.7 },
                    { name: "Little Prince Sherwani", category: "Kids", price: 3800, image: "https://images.unsplash.com/photo-1616428787754-0b70d421d898?w=500", rating: 4.8 },
                    { name: "Cotton Nightsuit Set", category: "Kids", price: 850, image: "https://images.unsplash.com/photo-1519238804368-68f9a2e8c255?w=500", rating: 4.5 },
                    { name: "Kids Designer Blazer", category: "Kids", price: 2800, image: "https://images.unsplash.com/photo-1574046714589-9bd176461993?w=500", rating: 4.6 },
                    { name: "Angelic White Gown", category: "Kids", price: 4500, image: "https://images.unsplash.com/photo-1621452773781-0f992ee61c60?w=500", rating: 4.9 },
                    { name: "Embroidered Boys Kurta", category: "Kids", price: 1500, image: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=500", rating: 4.4 },
                    { name: "Summer Sundress", category: "Kids", price: 950, image: "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=500", rating: 4.3 },
                    { name: "Mini Festive Lehenga", category: "Kids", price: 3500, image: "https://images.unsplash.com/photo-1628045620958-867c2957b8c8?w=500", rating: 4.8 },
                    { name: "Gentleman Suit for Kids", category: "Kids", price: 3200, image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500", rating: 4.6 },
                    { name: "Casual Graphic Tee", category: "Kids", price: 450, image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500", rating: 4.2 }
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
