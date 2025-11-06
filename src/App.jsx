import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {UserContext} from './context.jsx'
import './App.css'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Home from './components/Home'
import Movie from './components/Movie'
import Footer from './components/Footer'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ManageMovies from './components/ManageMovies'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import AddMovie from './components/AddMovie'
import EditMovie from './components/EditMovie' 
 

function App() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

   const [context, setContext] = useState(() => {
    const localData = window.sessionStorage.getItem("CONTEXT_APP");
    return localData ? JSON.parse(localData) : null;
  });

  const updatedContext = (newData) => {
    const updated = { ...(context || {}), ...newData };
    setContext(updated);
    window.sessionStorage.setItem("CONTEXT_APP", JSON.stringify(updated));
  };

  const BASE_URL = 'http://ec2-54-234-94-174.compute-1.amazonaws.com:8088';

  // Fetch movies data
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesResponseAPI = await axios.request(`${BASE_URL}/api/movies`);
    
        setMovies(moviesResponseAPI.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch movie reviews data
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsResponseAPI = await axios.get(`${BASE_URL}/api/reviews/all`);
        setReviews(reviewsResponseAPI.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Function to refresh movies list
  const refreshMovies = async () => {
    try {
      setLoading(true);
      const moviesResponseAPI = await axios.request(`${BASE_URL}/api/movies`);
      setMovies(moviesResponseAPI.data);
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing movies:", error);
      setLoading(false);
    }
  };
  
  // Function to refresh reviews list
  const refreshReviews = async () => {
    try {
      setLoading(true);
      const reviewsResponseAPI = await axios.get(`${BASE_URL}/api/reviews/all`);
      setReviews(reviewsResponseAPI.data);
      setLoading(false);
    } catch (error) {
      console.error("Error refreshing reviews:", error);
      setLoading(false);
    }
  };

  const handleMovieDeleted = async () => {
    await refreshMovies();
    await refreshReviews();
  }


  return (
    <BrowserRouter>
      <UserContext.Provider value={{context, updatedContext}}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home movies={movies} reviews={reviews} loading={loading} />} />
            <Route path="/login" element={<Login BASE_URL={BASE_URL} />} />
            <Route path="/register" element={<Register BASE_URL={BASE_URL} />} />
            <Route path="/dashboard" element={<Dashboard movies={movies} reviews={reviews} loading={loading} />} />
            <Route path="/manage-movies" element={<ManageMovies movies={movies} onMovieDeleted={handleMovieDeleted} loading={loading} BASE_URL={BASE_URL} />} />
            <Route path="/movie/:id" element={<Movie movies={movies} loading={loading} onReviewAdded={refreshReviews} movieUpdate={refreshMovies} BASE_URL={BASE_URL} refreshReviews={refreshReviews}  />} />
            <Route path="/add-movie" element={<AddMovie onMovieAdded={refreshMovies} BASE_URL={BASE_URL} />} />
            <Route path="/edit-movie/:id" element={<EditMovie onMovieUpdated={refreshMovies} BASE_URL={BASE_URL} />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
