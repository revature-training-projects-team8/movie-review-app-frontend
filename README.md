# 🎬 Movie Review App - Frontend

A modern, full-stack movie review application built with React, Spring Boot, and MySQL. Browse movies, write reviews, rate films, and manage your personal movie collection.

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Backend-green?logo=spring)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql)

---

## ✨ Features

- 🎥 **Browse Movies** - View 12+ curated movies with details
- 🔍 **Search & Filter** - Find movies by title, genre, or director
- ⭐ **Rate & Review** - Write reviews and rate movies 1-5 stars
- 👤 **User Profiles** - Track your reviews and favorite genres
- 🔐 **Authentication** - Secure login/register with BCrypt encryption
- 👨‍💼 **Admin Panel** - Initialize database with movie data
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop
- 🚀 **Real-time Updates** - Seamless backend integration

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **Java** 17+
- **MySQL** 8.0+
- **Maven** 3.6+

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/revature-training-projects-team8/movie-review-app-frontend.git
cd movie-review-app-frontend

# Install dependencies
npm install
```

### 2. Setup Database

```sql
-- Connect to MySQL
mysql -u root -p

-- Create database and tables
CREATE DATABASE movies;
USE movies;

-- Run the complete setup script
source d:/Projects/Revature/movie-review-app-frontend/sql/complete_database_setup.sql
```

### 3. Start Backend

```bash
# Clone backend repository
git clone https://github.com/revature-training-projects-team8/movie-review-app-backend.git
cd movie-review-app-backend

# Add SecurityConfig.java (see QUICK_INTEGRATION.md)
# Copy from: ../movie-review-app-frontend/backend-config/SecurityConfig.java
# To: src/main/java/com/moviereview/config/SecurityConfig.java

# Start Spring Boot
mvn spring-boot:run
```

**Verify backend:** http://localhost:8080/movies (should return `[]`)

### 4. Start Frontend

```bash
# Back to frontend directory
cd movie-review-app-frontend

# Start development server
npm run dev
```

**Open:** http://localhost:3001

### 5. Initialize Movies

1. Login with admin credentials:

   - **Username:** `admin`
   - **Password:** `admin123`

2. Go to Admin Panel: http://localhost:3001/admin

3. Click "Save All Movies to DB"

4. Wait for success message

5. Return to homepage to see all 12 movies!

---

## 📚 Documentation

| Document                                                     | Description                                 |
| ------------------------------------------------------------ | ------------------------------------------- |
| [QUICK_INTEGRATION.md](QUICK_INTEGRATION.md)                 | **START HERE** - 3-step integration guide   |
| [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md) | Complete backend setup with troubleshooting |
| [ARCHITECTURE.md](ARCHITECTURE.md)                           | Full system architecture diagram            |
| [DATABASE_SETUP.md](DATABASE_SETUP.md)                       | Database schema and SQL scripts             |
| [CORS_FIX.md](CORS_FIX.md)                                   | Fix CORS errors (if you see them)           |
| [USER_STORIES.md](USER_STORIES.md)                           | Product requirements and features           |

---

## 🎯 Default Credentials

### Admin Account

- **Username:** `admin`
- **Password:** `admin123`
- **Email:** admin@movies.com

### Test Users

- **john_doe** / password123
- **jane_smith** / password123
- **movie_buff** / password123
- **cinema_lover** / password123

---

## 🛠️ Tech Stack

### Frontend

- **React** 18.3.1 - UI framework
- **React Router** 6.28.0 - Routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend

- **Spring Boot** 3.x - REST API framework
- **Spring Security** - Authentication & CORS
- **Spring Data JPA** - ORM
- **BCrypt** - Password hashing
- **MySQL** - Database
- **Maven** - Build tool

### Database Schema

```sql
users (id, username, email, password, created_at)
movies (id, title, director, genre, description, poster_url, duration, release_date, avg_rating)
reviews (id, movie_id, user_id, rating, comment, created_at)
```

---

## 📂 Project Structure

```
movie-review-app-frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.jsx
│   │   ├── MovieCard.jsx
│   │   ├── ReviewForm.jsx
│   │   └── ReviewList.jsx
│   ├── pages/            # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── MovieDetailPage.jsx
│   │   └── AdminPanel.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── utils/            # Utilities
│   │   └── constants.js  # API config & movie data
│   ├── App.jsx
│   └── main.jsx
├── backend-config/       # Backend configuration files
│   └── SecurityConfig.java
├── sql/                  # Database scripts
│   └── complete_database_setup.sql
├── public/
├── docs/                 # Documentation
└── package.json
```

---

## 🔗 API Endpoints

### Authentication

- `POST /auth/login` - Login with username/password
- `POST /auth/register` - Register new user

### Movies

- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Create movie (admin only)
- `PUT /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)

### Reviews

- `GET /reviews/movie/:id` - Get reviews for a movie
- `POST /reviews` - Create review (authenticated)
- `PUT /reviews/:id` - Update own review
- `DELETE /reviews/:id` - Delete own review

---

## 🧪 Development

### Available Scripts

```bash
# Start development server (port 3001)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

---

## 🐛 Troubleshooting

### CORS Error

**Problem:** "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution:**

1. Verify `SecurityConfig.java` is in backend
2. Restart Spring Boot backend
3. See [CORS_FIX.md](CORS_FIX.md) for details

### Login Fails

**Problem:** "Invalid credentials" or login doesn't work

**Solution:**

1. Check MySQL is running
2. Verify admin user exists: `SELECT * FROM users WHERE username='admin';`
3. Password must be BCrypt hash starting with `$2a$10$`

### Movies Not Loading

**Problem:** Homepage shows "No movies found"

**Solution:**

1. Check backend is running: `curl http://localhost:8080/movies`
2. Go to http://localhost:3001/admin
3. Click "Save All Movies to DB"

### Port Already in Use

**Problem:** "Port 3001/8080 is already in use"

**Solution:**

```powershell
# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 🎨 Screenshots

### Homepage

Browse and search through movie collection

### Movie Details

View comprehensive movie information and reviews

### Login Page

Secure authentication with demo credentials

### Admin Panel

Initialize database with movie data

---

## 📝 License

This project is part of Revature training program.

---

## 🤝 Contributing

This is a training project. For issues or improvements:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 👥 Team

**Revature Training Projects - Team 8**

- Frontend: React + Vite
- Backend: Spring Boot
- Database: MySQL

---

## 🔗 Related Repositories

- **Backend:** [movie-review-app-backend](https://github.com/revature-training-projects-team8/movie-review-app-backend)
- **Frontend:** [movie-review-app-frontend](https://github.com/revature-training-projects-team8/movie-review-app-frontend)

---

## 📞 Support

For help with setup:

1. Check documentation files in root directory
2. Review troubleshooting sections
3. Verify all prerequisites are installed
4. Ensure backend and database are running

---

**Built with ❤️ using React, Spring Boot, and MySQL**
