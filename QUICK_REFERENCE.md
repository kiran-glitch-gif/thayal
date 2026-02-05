# 🚀 Thayal360 - Quick Reference

## 🌐 Live URLs

### Frontend
- **Local:** http://localhost:5173/
- **Network:** http://192.168.0.179:5173/

### Backend API
- **Local:** http://localhost:5000
- **Network:** http://192.168.0.179:5000

---

## 📋 API Endpoints Quick Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | User authentication |
| GET | `/api/products` | Get all products |
| GET | `/api/orders?email={email}` | Get user orders |
| POST | `/api/orders` | Create new order |

---

## 🛒 Order Placement Flow

1. **Browse Services** → `/services`
2. **Add to Cart** → Click "Stitch Now" → Customize → "Add to Cart"
3. **View Cart** → Click cart icon (top right)
4. **Checkout** → Fill delivery details
5. **Place Order** → Sends POST request to `/api/orders`
6. **View Orders** → Dashboard → "My Orders"

---

## 💻 Backend API Call Example

### Place an Order
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
// Response: { message: "Order created", id: 5 }
```

---

## 🧪 Test with cURL

```bash
# Place an order
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

---

## 📁 Key Files

- **Backend Server:** `backend/server.cjs`
- **Database:** `backend/database.cjs`
- **Store (State):** `src/store/useStore.js`
- **Checkout Page:** `src/pages/Checkout.jsx`
- **Services Page:** `src/pages/Services.jsx`

---

## 🔑 Test Credentials

**Email:** priya@example.com  
**Password:** 123456

---

## 📦 Order Data Structure

```json
{
  "id": "ORD1738734944123",
  "user_email": "priya@example.com",
  "item_name": "Designer Blouse",
  "status": "Pending",
  "tailor": "Auto-assigned",
  "delivery_date": "2026-02-20",
  "price": 1200
}
```

---

## ✅ Features Implemented

✓ User Authentication  
✓ Product Catalog  
✓ Shopping Cart  
✓ Order Placement (Backend Integration)  
✓ Order Tracking  
✓ Dashboard  
✓ Responsive Design  
✓ Header Alignment Fixed  

---

For detailed documentation, see: `API_DOCUMENTATION.md`
