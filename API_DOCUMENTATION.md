# Thayal360 Backend API Documentation

## Base URL
- **Development:** `http://localhost:5000`
- **Network Access:** `http://192.168.0.179:5000`

---

## API Endpoints

### 1. Authentication

#### Login
**POST** `/api/login`

Authenticates a user and returns user information with order count.

**Request:**
```json
{
  "email": "priya@example.com",
  "password": "123456"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "name": "Priya",
    "email": "priya@example.com",
    "wallet": 500,
    "orders": 2
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

**Example Usage:**
```javascript
const response = await fetch('http://localhost:5000/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'priya@example.com',
    password: '123456'
  })
});

const data = await response.json();
console.log(data.user);
```

---

### 2. Products

#### Get All Products
**GET** `/api/products`

Retrieves all available tailoring products/services.

**Response (Success - 200):**
```json
[
  {
    "id": 1,
    "name": "Designer Blouse",
    "category": "Women",
    "price": 1200,
    "image": "https://example.com/image.jpg",
    "rating": 4.5
  },
  {
    "id": 2,
    "name": "Kurta",
    "category": "Men",
    "price": 800,
    "image": "https://example.com/image2.jpg",
    "rating": 4.8
  }
]
```

**Example Usage:**
```javascript
const response = await fetch('http://localhost:5000/api/products');
const products = await response.json();
console.log(products);
```

---

### 3. Orders

#### Get User Orders
**GET** `/api/orders?email={user_email}`

Retrieves all orders for a specific user.

**Query Parameters:**
- `email` (required): User's email address

**Response (Success - 200):**
```json
[
  {
    "id": "ORD001",
    "user_email": "priya@example.com",
    "item_name": "Designer Blouse",
    "status": "In Progress",
    "tailor": "Ravi Kumar",
    "delivery_date": "2026-02-15",
    "price": 1200
  },
  {
    "id": "ORD002",
    "user_email": "priya@example.com",
    "item_name": "Kurta",
    "status": "Completed",
    "tailor": "Suresh Tailor",
    "delivery_date": "2026-02-10",
    "price": 800
  }
]
```

**Example Usage:**
```javascript
const userEmail = 'priya@example.com';
const response = await fetch(`http://localhost:5000/api/orders?email=${userEmail}`);
const orders = await response.json();
console.log(orders);
```

---

#### Create Order (Place Order)
**POST** `/api/orders`

Creates a new order in the system.

**Request Body:**
```json
{
  "id": "ORD123",
  "user_email": "priya@example.com",
  "item_name": "Designer Blouse",
  "status": "Pending",
  "tailor": "Auto-assigned",
  "delivery_date": "2026-02-20",
  "price": 1200
}
```

**Field Descriptions:**
- `id` (string): Unique order identifier (e.g., "ORD" + timestamp)
- `user_email` (string): Email of the user placing the order
- `item_name` (string): Name of the product/service being ordered
- `status` (string): Order status (e.g., "Pending", "In Progress", "Completed")
- `tailor` (string): Assigned tailor name or "Auto-assigned"
- `delivery_date` (string): Expected delivery date in YYYY-MM-DD format
- `price` (number): Total price of the order

**Response (Success - 200):**
```json
{
  "message": "Order created",
  "id": 5
}
```

**Response (Error - 500):**
```json
{
  "error": "Database error message"
}
```

**Example Usage:**
```javascript
const orderData = {
  id: `ORD${Date.now()}`,
  user_email: 'priya@example.com',
  item_name: 'Designer Blouse',
  status: 'Pending',
  tailor: 'Auto-assigned',
  delivery_date: '2026-02-20',
  price: 1200
};

const response = await fetch('http://localhost:5000/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});

const result = await response.json();
console.log(result); // { message: "Order created", id: 5 }
```

---

## Complete Order Flow Example

Here's how the complete order placement flow works in the Thayal360 app:

### Step 1: User Browses Services
```javascript
// Fetch products from backend
const response = await fetch('/api/products');
const products = await response.json();
```

### Step 2: User Adds Items to Cart
```javascript
// Add to cart (local state)
addToCart({
  id: Date.now(),
  name: 'Designer Blouse',
  price: 1200,
  category: 'Women',
  customization: {
    fabric: 'silk',
    neckline: 'Round',
    embroidery: true
  },
  finalPrice: 2200 // base price + embroidery
});
```

### Step 3: User Proceeds to Checkout
```javascript
// Navigate to /checkout page
navigate('/checkout');
```

### Step 4: User Places Order
```javascript
// For each item in cart, create an order
const placeOrder = async (orderData) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  
  return await response.json();
};

// Place orders for all cart items
const orderPromises = cart.map(item => {
  return placeOrder({
    id: `ORD${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    user_email: user.email,
    item_name: item.name,
    status: 'Pending',
    tailor: 'Auto-assigned',
    delivery_date: '2026-02-20',
    price: item.finalPrice || item.price
  });
});

const results = await Promise.all(orderPromises);
```

### Step 5: View Orders in Dashboard
```javascript
// Fetch user's orders
const response = await fetch(`/api/orders?email=${user.email}`);
const orders = await response.json();
```

---

## Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"priya@example.com","password":"123456"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

**Get Orders:**
```bash
curl "http://localhost:5000/api/orders?email=priya@example.com"
```

**Create Order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "ORD123456",
    "user_email": "priya@example.com",
    "item_name": "Designer Blouse",
    "status": "Pending",
    "tailor": "Auto-assigned",
    "delivery_date": "2026-02-20",
    "price": 1200
  }'
```

### Using Postman

1. **Import Collection:** Create a new collection named "Thayal360 API"
2. **Set Base URL:** `http://localhost:5000`
3. **Add Requests:**
   - POST Login: `/api/login`
   - GET Products: `/api/products`
   - GET Orders: `/api/orders?email=priya@example.com`
   - POST Create Order: `/api/orders`

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK:** Request successful
- **401 Unauthorized:** Invalid credentials (login)
- **500 Internal Server Error:** Database or server error

Error responses follow this format:
```json
{
  "error": "Error message description"
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  wallet INTEGER DEFAULT 0
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  rating REAL
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  item_name TEXT NOT NULL,
  status TEXT NOT NULL,
  tailor TEXT,
  delivery_date TEXT,
  price INTEGER NOT NULL
);
```

---

## Frontend Integration

The frontend uses Zustand store to manage API calls:

**Location:** `src/store/useStore.js`

**Available Functions:**
- `login(email, password)` - Authenticates user
- `logout()` - Logs out user
- `addToCart(item)` - Adds item to cart
- `removeFromCart(id)` - Removes item from cart
- `clearCart()` - Clears all cart items
- `placeOrder(orderData)` - Places order via API

**Checkout Page:** `src/pages/Checkout.jsx`

This page handles the complete order placement flow, including:
- Displaying cart items
- Collecting delivery information
- Calling the `/api/orders` endpoint
- Clearing cart after successful order

---

## Live URLs

**Frontend:**
- Local: http://localhost:5173/
- Network: http://192.168.0.179:5173/

**Backend API:**
- Local: http://localhost:5000
- Network: http://192.168.0.179:5000

**Key Pages:**
- Home: http://localhost:5173/
- Services: http://localhost:5173/services
- Checkout: http://localhost:5173/checkout
- Dashboard: http://localhost:5173/dashboard

---

## Notes

- All API requests from the frontend are automatically proxied through Vite
- Frontend requests to `/api/*` are forwarded to `http://localhost:5000`
- CORS is enabled on the backend for cross-origin requests
- The database is SQLite, stored in `backend/database.db`
