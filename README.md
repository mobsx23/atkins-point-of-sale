# Atkins Guitar Store - Point of Sale System

A modern, offline-first Point of Sale (POS) web application built with React.js for guitar retail stores. This frontend-only application runs entirely in the browser with localStorage persistence and offline capabilities.

![Atkins Guitar Store POS](https://lovable.dev/opengraph-image-p98pqg.png)

## 🎸 Features

### Core Functionality
- **Simulated Authentication** - Secure admin login (demo credentials provided)
- **Inventory Management** - Complete CRUD operations for guitar products
- **Point of Sale** - Interactive sales interface with cart management
- **Transaction History** - View and search all completed sales
- **Reports & Analytics** - Sales and inventory insights
- **Receipt Printing** - Professional printable receipts
- **Data Backup/Restore** - Export and import data as JSON
- **Offline Support** - Service worker for offline functionality

### Product Categories
- Electric Guitars
- Acoustic Guitars
- Bass Guitars
- Accessories

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn installed
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd atkins-guitar-pos
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:8080`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🔐 Demo Credentials

**Username:** `admin`  
**Password:** `admin123`

*Note: This is a simulated authentication system for demonstration purposes only.*

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/login` | Admin login page |
| `/dashboard` | Sales overview and statistics |
| `/pos` | Point of Sale interface |
| `/inventory` | Product management |
| `/transactions` | Transaction history |
| `/reports` | Sales & inventory reports |
| `/settings` | App configuration and data management |

## 💾 Data Management

### Storage
All data is stored in browser localStorage:
- Products (inventory items)
- Transactions (sales history)
- User credentials (hashed)
- App settings

### Backup Data
1. Navigate to **Settings** page
2. Click **Export Backup**
3. Save the JSON file to your computer

### Restore Data
1. Navigate to **Settings** page
2. Click **Import Backup**
3. Select your previously exported JSON file
4. Confirm the import (this will overwrite existing data)

### Reset to Demo Data
1. Navigate to **Settings** page
2. Click **Reset Demo Data**
3. Confirm (this will delete all current data)

## 🖨️ Printing Receipts

1. Complete a sale at the POS
2. Receipt dialog appears automatically
3. Click **Print Receipt** button
4. Use browser print dialog to print or save as PDF

You can also print receipts from the **Transactions** page by clicking "View Receipt" on any transaction.

## 📊 Reports

### Sales Report
- Total revenue
- Transaction count
- Average transaction value
- Payment type breakdown (Cash vs GCash)
- Top selling products

### Inventory Report
- Total products
- Stock value
- Low stock alerts
- Product details

Both reports can be exported as JSON files.

## 🛠️ Technology Stack

- **Framework:** React 18 (Functional Components + Hooks)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Routing:** React Router v6
- **State Management:** React Context API
- **Styling:** Tailwind CSS + shadcn/ui components
- **Printing:** react-to-print
- **Data Persistence:** localStorage
- **Offline Support:** Service Worker

## 📁 Project Structure

```
atkins-guitar-pos/
├── public/
│   ├── service-worker.js    # Offline support
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── Layout.tsx       # Main app layout with sidebar
│   │   ├── ProtectedRoute.tsx
│   │   └── ReceiptPrint.tsx # Receipt component
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   └── InventoryContext.tsx
│   ├── lib/
│   │   ├── storage.ts       # localStorage utilities
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── POS.tsx
│   │   ├── Inventory.tsx
│   │   ├── Transactions.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Design system
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Design System

The application uses a custom design system with:
- **Primary Color:** Deep burgundy/wine red (guitar finish inspired)
- **Accent Color:** Warm amber/gold (brass hardware inspired)
- **Success Color:** Forest green
- **Warning Color:** Amber (low stock alerts)

All colors are defined using HSL values in `src/index.css` and applied through semantic tokens via Tailwind CSS.

## 🔧 Configuration

### Store Settings
Configure via **Settings** page:
- Store name
- Store address
- Default low stock threshold

### Low Stock Thresholds
Each product has individual minimum stock threshold settings. When stock falls at or below this threshold, visual indicators appear throughout the app.

## 🌐 Offline Functionality

The app uses a service worker to enable offline operation:
- App shell caching
- Static asset caching
- Continues to work without internet connection
- Data persists in browser storage

## 📝 Sample Data

The app comes with pre-loaded demo data:
- 8 sample guitar products
- 2 sample transactions
- Demo admin account
- Default settings

## ⚠️ Important Notes

### Security Disclaimer
This is a **demo/development application** with simulated authentication. For production use:
- Implement proper backend authentication
- Use secure password hashing (bcrypt, Argon2)
- Add HTTPS/SSL
- Implement proper session management
- Add role-based access control

### Browser Storage Limitations
- localStorage has ~5-10MB limit per domain
- Data is tied to the browser/device
- Clearing browser data will delete all information
- Not suitable for multi-user or multi-device scenarios without backend sync

### Production Considerations
For a production deployment, consider:
- Backend API integration
- Database storage (PostgreSQL, MongoDB)
- User authentication system
- Cloud backup and sync
- Multi-store support
- Receipt printer integration
- Barcode scanner support

## 🤝 Contributing

This is a demonstration project. Feel free to fork and adapt for your needs.

## 📄 License

This project is provided as-is for demonstration purposes.

## 🆘 Support

For issues or questions about this Lovable project, visit:
- [Lovable Documentation](https://docs.lovable.dev/)
- [Project URL](https://lovable.dev/projects/e35c313f-3d51-4cb3-a4a3-3032114d8ccc)

## 🎯 Roadmap / Future Enhancements

Potential improvements for production use:
- [ ] Backend integration (Supabase, Firebase)
- [ ] Multi-user support
- [ ] Advanced reporting with charts
- [ ] Product images upload
- [ ] Barcode scanning
- [ ] Receipt printer integration
- [ ] Customer management
- [ ] Discount/promotion system
- [ ] Email receipts
- [ ] Payment gateway integration
- [ ] Multi-currency support
- [ ] Inventory forecasting

---

**Built with ❤️ using [Lovable](https://lovable.dev) - Build full-stack applications with AI**
