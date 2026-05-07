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

## 📸 9. Screenshots

*(Add your screenshots here!)*

| Dashboard Overview | Expenses Management |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x400.png?text=Dashboard+Screenshot" width="400" alt="Dashboard" /> | <img src="https://via.placeholder.com/600x400.png?text=Expenses+Screenshot" width="400" alt="Expenses" /> |

| Dark Mode UI | Authentication |
| :---: | :---: |
| <img src="https://via.placeholder.com/600x400.png?text=Dark+Mode+Screenshot" width="400" alt="Dark Mode" /> | <img src="https://via.placeholder.com/600x400.png?text=Login+Screenshot" width="400" alt="Login" /> |

---

## 🤖 10. AI Tools Usage

This project was built and accelerated using Advanced AI Coding Assistants.
- **AI Agent:** Google Deepmind's Antigravity (Agentic AI)
- **Role:** The AI functioned as a senior full-stack pair programmer, responsible for architecting the MERN stack, implementing complex React state management (Context API), designing the premium CSS UI, and generating robust MongoDB schemas. 
- **Efficiency:** The AI seamlessly handled both backend API routing and frontend data visualization, ensuring production-ready code quality and rapid iteration.

---

## 🔮 11. Future Improvements

- [ ] Implement user profile updates (change name, email, password).
- [ ] Add support for multiple currencies.
- [ ] Implement recurring expenses (subscriptions).
- [ ] Add calendar view for expense tracking.
- [ ] Enhance server-side pagination for extremely large datasets.

---

## 📄 12. License

This project is licensed under the MIT License - see the LICENSE file for details.
