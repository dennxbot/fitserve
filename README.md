# FITSERVE 🏋️‍♂️🥗

A comprehensive fitness and nutrition tracking application built with modern web technologies. FITSERVE helps users track their fitness goals, monitor nutrition intake, and maintain healthy habits through an intuitive and feature-rich interface.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Profile Management**: Personalized user profiles with health metrics
- **Nutrition Tracking**: Log daily food intake with detailed nutritional information
- **Weight Progress**: Track weight changes and visualize progress over time
- **Goal Setting**: Set and monitor fitness goals (lose weight, gain muscle, maintain)
- **USDA Food Database**: Access to comprehensive food nutrition data
- **Barcode Scanning**: Quick food entry via barcode scanning
- **Reports & Analytics**: Detailed nutrition reports and trend analysis

### Key Highlights
- 📊 Interactive dashboards with real-time data visualization
- 🎯 Personalized nutrition goals based on user metrics
- 📱 Responsive design for mobile and desktop
- 🔍 Food search with USDA database integration
- 📸 Camera-based barcode scanning for quick food logging
- 📈 Progress tracking with visual charts and statistics
- 🍽️ Meal categorization (Breakfast, Lunch, Dinner, Snacks)
- 📅 Daily, weekly, and monthly nutrition summaries

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **Axios** - HTTP client
- **Chart.js** - Data visualization
- **ZXing** - Barcode scanning library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - Backend as a Service (Database & Auth)
- **PostgreSQL** - Database (via Supabase)
- **JWT** - Authentication tokens
- **USDA FoodData Central API** - Nutrition data
- **bcrypt** - Password hashing
- **Joi** - Data validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- USDA API key (free from [FoodData Central](https://fdc.nal.usda.gov/api-key-signup.html))

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/dennxbot/fitserve.git
cd fitserve
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret
USDA_API_KEY=your_usda_api_key
NODE_ENV=development
```

Run database migrations (if needed):
```bash
# Execute migration files in supabase/migrations/
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📱 Usage

1. **Register**: Create a new account with your personal information and fitness goals
2. **Set Goals**: Define your target weight and fitness objectives
3. **Log Food**: Search and add food items to track daily nutrition
4. **Track Progress**: Log weight entries and monitor your progress
5. **View Reports**: Analyze nutrition patterns and trends
6. **Scan Barcodes**: Use camera to quickly add packaged foods

## 🗂️ Project Structure

```
FITSERVE/
├── backend/               # Express.js backend
│   ├── config/           # Configuration files
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
│
├── frontend/             # Vue.js frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── views/        # Page components
│   │   ├── stores/       # Pinia stores
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── router/       # Vue Router config
│   └── index.html        # Entry HTML
│
├── supabase/             # Database files
│   ├── migrations/       # Database migrations
│   └── database_schema.sql
│
└── .trae/                # Documentation
    └── documents/        # Technical docs
```

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 3000) |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_KEY | Supabase anonymous key |
| JWT_SECRET | Secret for JWT token generation |
| USDA_API_KEY | USDA FoodData Central API key |
| NODE_ENV | Environment (development/production) |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API URL |

## 📊 Database Schema

The application uses PostgreSQL (via Supabase) with the following main tables:
- `users` - User profiles and authentication
- `foods` - Food entries and nutrition data
- `weight_entries` - Weight tracking records
- `nutrition_goals` - User nutrition targets
- `food_categories` - Food categorization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Token refresh mechanism needs optimization
- Barcode scanning accuracy depends on camera quality
- USDA API rate limits may affect food search

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**dennxbot**
- GitHub: [@dennxbot](https://github.com/dennxbot)

## 🙏 Acknowledgments

- USDA FoodData Central for nutrition data
- Supabase for backend infrastructure
- Vue.js community for excellent documentation
- All contributors and testers

## 📞 Support

For issues and questions, please use the [GitHub Issues](https://github.com/dennxbot/fitserve/issues) page.

---

**Happy tracking! 💪** Built with ❤️ for fitness enthusiasts
