# 🚨 Authentication & 403 Forbidden Error Fix Guide

## Current Issue

You're experiencing **403 Forbidden errors** on all API endpoints, which means the backend is blocking requests due to authentication issues.

## Fixed Code Changes ✅

### 1. Simplified API Architecture (No More Constants.js!)

- ✅ **Removed constants.js dependency** - now using database directly since movies are already in DB
- ✅ **HomePage simplified** - only uses `api.get("/movies")` from AuthContext
- ✅ **MovieDetailPage simplified** - removed fallback logic, database-only approach
- ✅ Added `withCredentials: true` to AuthContext axios instance for session-based auth
- ✅ Added proper error handling for 403/404 responses

### 2. Added AuthDebug Component

- ✅ Created `AuthDebug.jsx` for testing authentication
- ✅ Temporarily added to HomePage for debugging

## 🔧 Steps to Test & Fix

### Step 1: Start the Application

```bash
npm start
```

### Step 2: Check Backend Status

Make sure your Spring Boot backend is running on `localhost:8080`:

```bash
# If you have the start-backend.bat file:
./start-backend.bat

# Or manually start your Spring Boot application
```

### Step 3: Test Authentication Flow

1. **Open the app** in your browser (usually `localhost:3000`)
2. **Look for the "Auth Debug" panel** in the top-right corner
3. **Login as admin**:
   - Username: `admin`
   - Password: `admin123` (or whatever admin credentials you have)
4. **Click "Test Auth"** button in the debug panel
5. **Check browser console** for detailed authentication logs

### Step 4: Expected Debug Output

**If authentication works correctly:**

```
=== AUTHENTICATION DEBUG ===
User: {username: "admin", role: "ADMIN", id: 1}
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
✅ API call successful: [array of movies]
✅ Direct fetch successful: [array of movies]
```

**If authentication fails:**

```
❌ API call failed: AxiosError {message: 'Request failed with status code 403'...}
❌ Direct fetch failed: 403 Forbidden
```

## 🚑 Common Solutions

### Solution 1: Backend Not Running

- Start your Spring Boot backend
- Verify it's accessible at `http://localhost:8080/movies`

### Solution 2: Login Required

- Make sure you're logged in as an admin user
- Clear localStorage and login again: `localStorage.clear()`

### Solution 3: Backend Security Configuration

Your backend might need CORS configuration:

```java
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
```

### Solution 4: Session vs JWT Authentication

The code now supports both:

- **JWT tokens**: If `localStorage.getItem('token')` exists
- **Session cookies**: With `credentials: 'include'` in requests

## 🔍 Debug Commands

Open browser console and run:

```javascript
// Check current authentication state
console.log("User:", JSON.parse(localStorage.getItem("user") || "{}"));
console.log("Token:", localStorage.getItem("token"));

// Test direct API call
fetch("http://localhost:8080/movies", {
  credentials: "include",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
})
  .then((r) => (r.ok ? r.json() : r.text()))
  .then(console.log);
```

## 📋 Next Steps

1. **Test the auth debug component**
2. **Report what you see in the console**
3. **Confirm backend is running and accessible**
4. **Try logging in as admin and test again**

Once authentication is working, all the 403 errors should disappear and you'll be able to:

- View movie details
- Create/edit/delete movies in AdminPanel
- Access all protected endpoints

## 🧹 Cleanup After Testing

Once authentication is working, remove the debug component:

1. Remove `<AuthDebug />` from HomePage.jsx
2. Remove the import: `import AuthDebug from '../components/AuthDebug';`
3. Delete `src/components/AuthDebug.jsx` file
