import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const AuthContext = createContext();

// Helper function to safely get user from localStorage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.warn("Failed to parse stored user:", error);
    localStorage.removeItem("user");
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Axios Instance for authenticated requests
  const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Include cookies for session-based auth
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  // Add response interceptor for better error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }

    if (token && !user) {
      // Try to restore user session
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.warn("Failed to parse stored user data:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      // Backend returns user object with token
      const userDetails = response.data;

      // Check if response contains a token field and user data
      if (userDetails && userDetails.id) {
        // Store user data (without token for security)
        const userWithoutToken = { ...userDetails };
        delete userWithoutToken.token; // Don't store token in user object
        localStorage.setItem("user", JSON.stringify(userWithoutToken));
        setUser(userWithoutToken);

        // Handle JWT token if present
        if (userDetails.token) {
          localStorage.setItem("token", userDetails.token);
          setToken(userDetails.token);
        } else {
        }

        navigate("/");
        return { success: true };
      } else {
        throw new Error("Invalid login response: missing user data");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);

      // Detailed error logging
      if (error.response) {
        // Server responded with error status
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);

        // Build detailed error message
        let errorMessage = "";

        if (error.response.status === 403) {
          errorMessage =
            "🔒 Access Forbidden (403): Backend Spring Security is blocking the request. Please add SecurityConfig.java to your backend and restart.";
        } else if (error.response.status === 401) {
          errorMessage =
            "🔑 Invalid username or password. Please check your credentials.";
        } else if (error.response.status === 404) {
          errorMessage =
            "❌ Login endpoint not found (404). Check if AuthController exists in backend.";
        } else if (error.response.status === 500) {
          errorMessage =
            "⚠️ Server error (500): " +
            (error.response.data?.message || "Internal server error");
        } else {
          errorMessage =
            error.response.data?.message ||
            `Server error (${error.response.status})`;
        }

        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        // Request made but no response received
        console.error("No response received:", error.request);
        return {
          success: false,
          error:
            "🔌 Cannot connect to backend. Make sure backend is running on http://localhost:8080",
        };
      } else {
        // Error in request setup
        console.error("Request error:", error.message);
        return {
          success: false,
          error: "Error setting up login request: " + error.message,
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });

      navigate("/login");
      return {
        success: true,
        message: "Registration successful! Please log in.",
      };
    } catch (error) {
      console.error("❌ Registration failed:", error);

      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);

        let errorMessage = "";

        if (error.response.status === 403) {
          errorMessage =
            "🔒 Access Forbidden (403): Backend Spring Security is blocking the request. Please add SecurityConfig.java to your backend and restart.";
        } else if (error.response.status === 409) {
          errorMessage =
            "⚠️ Username or email already exists. Please use different credentials.";
        } else if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message ||
            "❌ Invalid registration data. Please check all fields.";
        } else {
          errorMessage =
            error.response.data?.message ||
            `Server error (${error.response.status})`;
        }

        return {
          success: false,
          error: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          error:
            "🔌 Cannot connect to backend. Make sure backend is running on http://localhost:8080",
        };
      } else {
        return {
          success: false,
          error: "Error setting up registration request: " + error.message,
        };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        api,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
