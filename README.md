# 🧵 Thayal360 - Doorstep Tailoring Platform

A modern, full-stack web application for custom tailoring services with doorstep delivery.

![Thayal360](public/logo.png)

## 🌟 Features

- ✅ **User Authentication** - Secure login system
- ✅ **Product Catalog** - Browse 30+ tailoring designs
- ✅ **Custom Orders** - Personalize fabric, neckline, and embroidery
- ✅ **Shopping Cart** - Add multiple items
- ✅ **Order Placement** - Backend integration with SQLite
- ✅ **Order Tracking** - Real-time status updates
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dashboard** - User profile and order history

## 🚀 Live Demo

- **Frontend:** [http://localhost:5173/](http://localhost:5173/)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Ant Design** - UI components
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **SQLite** - Database
- **CORS** - Cross-origin support

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/thayal360.git
cd thayal360
```

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🗂️ Project Structure

```
thayal360/
├── backend/
│   ├── server.cjs          # Express server
│   └── database.cjs        # SQLite database setup
├── src/
│   ├── components/
│   │   └── MainLayout.jsx  # Main layout with header/footer
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── Services.jsx    # Product catalog
│   │   ├── Checkout.jsx    # Cart & checkout
│   │   ├── Dashboard.jsx   # User dashboard
│   │   ├── Track.jsx       # Order tracking
│   │   └── Contact.jsx     # Contact page
│   ├── store/
│   │   └── useStore.js     # Zustand state management
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/
│   └── logo.png            # Brand logo
├── API_DOCUMENTATION.md    # Complete API docs
├── QUICK_REFERENCE.md      # Quick reference guide
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - User login

### Products
- `GET /api/products` - Get all products

### Orders
- `GET /api/orders?email={email}` - Get user orders
- `POST /api/orders` - Create new order

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation.

## 🧪 Test Credentials

**Email:** priya@example.com  
**Password:** 123456

## 📱 How to Use

1. **Browse Services** → Navigate to Services page
2. **Select Item** → Click "Stitch Now"
3. **Customize** → Choose fabric, neckline, add-ons
4. **Add to Cart** → Click "Add to Cart"
5. **Checkout** → Click cart icon, fill delivery details
6. **Place Order** → Order saved to database
7. **Track** → View order status in Dashboard

## 🌐 Deployment

### Deploy Frontend (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts to deploy

### Deploy Backend (Render/Railway)

#### Option 1: Render
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `node backend/server.cjs`
6. Deploy

#### Option 2: Railway
1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables if needed
4. Deploy automatically

### Environment Variables

Create `.env` file for production:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=./backend/database.db
```

## 🔧 Build for Production

### Frontend
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📊 Database Schema

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

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Contact

**Thayal360 Team**
- Email: support@thayal360.com
- Phone: +91 63816 06246
- Location: Salem, Tamil Nadu

## 🙏 Acknowledgments

- Ant Design for UI components
- Vite for blazing fast development
- React team for the amazing framework

---

**Made with ❤️ by Thayal360 Team**
