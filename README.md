<div align="center">
  
  # 💸 ExpenseIQ

  <p align="center">
    <strong>A modern, premium, full-stack expense tracker and analytics dashboard.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge"/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS Badge"/>
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="ExpressJS Badge"/>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Badge"/>
  </p>

</div>

---

## 📖 1. Project Overview

**ExpenseIQ** is a comprehensive financial management application designed to help users track, analyze, and manage their daily expenses. Built with a modern MERN stack (MongoDB, Express, React, Node.js), ExpenseIQ features a premium "fintech" aesthetic, complete with dark mode, interactive charts, AI-driven spending insights, and a dynamic budget management system.

---

## 🌐 Live Demo

🔗 Frontend: https://expense-iq-zeta.vercel.app

🔗 Backend API: https://expenseiq-4yji.onrender.com

---

## ✨ 2. Features

- **🔐 Secure Authentication:** JWT-based user login and registration with encrypted passwords.
- **📊 Modern Dashboard:** A beautiful, responsive CSS-Grid dashboard displaying interactive Recharts (Pie, Bar, Line).
- **💡 Smart Insights:** Auto-generated text insights based on month-over-month spending patterns.
- **💰 Budget Management:** Set a monthly budget and track your spending with color-coded progress bars and dynamic warnings.
- **📝 Expense Tracking:** Add, edit, and delete expenses using clean, reusable modals. Features category tagging and payment method tracking.
- **🔍 Advanced Filtering:** Search expenses by title, filter by category, and sort by date or amount.
- **📄 CSV Export:** Download your currently filtered expense data directly to a `.csv` file.
- **🌓 Dark Mode:** Seamless toggle between light and dark themes (saves preference to local storage).
- **📱 Fully Responsive:** Carefully crafted layouts that look stunning on desktop, tablet, and mobile devices.

---

## 🛠️ 3. Tech Stack

### Frontend
- **React.js (Vite)**
- **Bootstrap 5** (Customized styling)
- **React Router DOM** (Navigation)
- **Recharts** (Data Visualization)
- **React Toastify** (Notifications)
- **React Icons** (SVG Icons)
- **Axios** (API Requests)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (Database & ODM)
- **JSON Web Tokens (JWT)** (Authentication)
- **Bcrypt.js** (Password Hashing)
- **Cors & Dotenv** (Environment Management)

---

## 📂 4. Folder Structure

```text
ExpenseIQ/
├── client/                 # React Frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI elements & Modals
│       │   ├── charts/     # Recharts components
│       │   └── ui/         # Generic buttons, cards
│       ├── context/        # Auth & Theme Context providers
│       ├── layouts/        # Sidebar & Navbar wrappers
│       ├── pages/          # Main application views
│       ├── services/       # Axios API configurations
│       ├── styles/         # Custom CSS & Theming variables
│       └── utils/          # Dashboard calculations & CSV exports
│
└── server/                 # Node.js Backend
    ├── config/             # DB Connection logic
    ├── controllers/        # Route logic (Auth, Expenses, Budget)
    ├── middleware/         # JWT Protection middleware
    ├── models/             # Mongoose Schemas
    └── routes/             # Express Route definitions
```

---

## 🗄️ 5. Database Schema

### `User`
- `name` (String, Required)
- `email` (String, Required, Unique)
- `password` (String, Required)
- `createdAt` (Date)

### `Expense`
- `user` (ObjectId, Ref: 'User')
- `title` (String, Required)
- `amount` (Number, Required)
- `category` (Enum: Food, Travel, Shopping, Bills, Entertainment, Health, Education, Other)
- `paymentMethod` (Enum: Cash, Credit Card, Debit Card, Bank Transfer, Other)
- `description` (String, Optional)
- `date` (Date, Default: Date.now)

### `Budget`
- `user` (ObjectId, Ref: 'User', Unique)
- `amount` (Number, Required)

---

## 🔌 6. API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Authenticate user & get token | Public |
| GET | `/me` | Get current logged in user | Private |

### Expenses (`/api/v1/expenses`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get all expenses for logged in user | Private |
| POST | `/` | Add a new expense | Private |
| PUT | `/:id` | Update an existing expense | Private |
| DELETE| `/:id` | Delete an expense | Private |

### Budget (`/api/v1/budget`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | Get user's monthly budget | Private |
| POST | `/` | Set or update monthly budget | Private |

---

## 🚀 7. Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Manvith-kumar16/ExpenseIQ.git
cd ExpenseIQ
```

### 2. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Start the frontend server:
```bash
npm run dev
```

---

## 🌍 8. Deployment Instructions

### Backend (Render / Heroku)
1. Push your code to GitHub.
2. Connect the repository to your hosting provider.
3. Set the Root Directory to `server`.
4. Configure Environment Variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`).
5. Set the build command to `npm install` and start command to `node server.js`.

### Frontend (Vercel / Netlify)
1. Connect the repository to Vercel/Netlify.
2. Set the Root Directory to `client`.
3. Configure the Environment Variable (`VITE_API_URL` pointing to your deployed backend URL).
4. Framework preset should automatically detect `Vite` (Build command: `npm run build`, Output directory: `dist`).

---

## 🤖 9. AI Tools Usage

AI-assisted development tools were used during the development process to improve productivity and accelerate implementation.

### Tools Used
- ChatGPT
- Antigravity AI
- GitHub Copilot

### How AI Assisted Development
- Assisted in planning the MERN stack architecture
- Helped generate reusable frontend components
- Assisted with backend API structure and authentication flow
- Helped debug deployment and CORS issues
- Assisted with UI/UX refinement and responsive layouts
- Provided optimization suggestions for production deployment

### Developer Contribution

Although AI-assisted tools were used to accelerate certain parts of development, the complete application architecture, feature integration, debugging process, deployment pipeline, and final implementation decisions were independently handled and verified by the developer.

Key contributions include:

- Designed and structured the complete MERN stack architecture
- Built and integrated frontend and backend modules manually
- Implemented JWT authentication and protected routing
- Configured MongoDB Atlas database integration and schema relationships
- Developed responsive dashboard layouts and reusable UI components
- Customized the complete UI/UX to achieve a premium fintech-style interface
- Integrated charts, analytics, filtering, budget tracking, and CSV export functionality
- Handled API integration, state management, and frontend-backend communication
- Debugged and resolved production deployment issues including:
  - CORS configuration
  - Environment variables
  - API routing
  - MongoDB Atlas connectivity
  - Render and Vercel deployment setup
- Optimized responsiveness across desktop, tablet, and mobile devices
- Performed end-to-end testing of authentication, CRUD operations, analytics, and deployment workflows
- Refactored generated code for maintainability, scalability, and cleaner architecture
- Reviewed, modified, and validated all AI-generated outputs before integration into the final project

The project reflects practical full-stack development skills including system design, API development, responsive frontend engineering, cloud deployment, debugging, and production-level application structuring.

---

## 🔮 10. Future Improvements

- [ ] Implement user profile updates (change name, email, password).
- [ ] Add support for multiple currencies.
- [ ] Implement recurring expenses (subscriptions).
- [ ] Add calendar view for expense tracking.
- [ ] Enhance server-side pagination for extremely large datasets.

---

## 📄 11. License

This project is licensed under the MIT License
