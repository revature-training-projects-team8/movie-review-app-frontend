import React, { useState, useEffect } from 'react';
import { Star, Calendar, Film, Edit, Trash2, MessageCircle, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { REAL_MOVIES_DATA, MOCK_REVIEWS, getAllMoviesFromDB, getAllMovies } from '../utils/constants';

const ProfilePage = () => {
  const { user, api, isAuthenticated } = useAuth();
  const [userReviews, setUserReviews] = useState([]);
  const [movies, setMovies] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    favoriteGenre: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserReviews();
    }
  }, [isAuthenticated]);

  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      // Fetch user's reviews
      const reviewsResponse = await api.get(`/reviews/user/${user.id}`);
      const reviews = reviewsResponse.data;
      
      // Fetch movie details for each review
      const moviePromises = reviews.map(review => 
        api.get(`/movies/${review.movieId}`).catch(() => null)
      );
      const movieResponses = await Promise.all(moviePromises);
      
      // Create movies lookup
      const moviesLookup = {};
      movieResponses.forEach((response, index) => {
        if (response) {
          moviesLookup[reviews[index].movieId] = response.data;
        }
      });
      
      setUserReviews(reviews);
      setMovies(moviesLookup);
      calculateStats(reviews, moviesLookup);
      
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      
      // Fallback to mock data
      const mockUserReviews = MOCK_REVIEWS.filter(
        review => review.username === user?.username
      );
      const mockMoviesLookup = {};
      mockUserReviews.forEach(review => {
        const movie = REAL_MOVIES_DATA.find(m => m.id === review.movieId);
        if (movie) {
          mockMoviesLookup[review.movieId] = movie;
        }
      });
      
      setUserReviews(mockUserReviews);
      setMovies(mockMoviesLookup);
      calculateStats(mockUserReviews, mockMoviesLookup);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviews, moviesLookup) => {
    if (reviews.length === 0) {
      setStats({ totalReviews: 0, averageRating: 0, favoriteGenre: '' });
      return;
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    // Calculate favorite genre
    const genreCounts = {};
    reviews.forEach(review => {
      const movie = moviesLookup[review.movieId];
      if (movie && movie.genre) {
        genreCounts[movie.genre] = (genreCounts[movie.genre] || 0) + 1;
      }
    });
    
    const favoriteGenre = Object.keys(genreCounts).reduce(
      (a, b) => genreCounts[a] > genreCounts[b] ? a : b, 
      ''
    );

    setStats({ totalReviews, averageRating, favoriteGenre });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      const updatedReviews = userReviews.filter(review => review.id !== reviewId);
      setUserReviews(updatedReviews);
      calculateStats(updatedReviews, movies);
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Film className="w-24 h-24 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 mb-8 border border-gray-700">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mr-6">
              <span className="text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.username}
              </h1>
              <p className="text-gray-600">Movie Enthusiast</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 rounded-lg p-6 text-center">
              <MessageCircle className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-primary-600">{stats.totalReviews}</h3>
              <p className="text-primary-700 font-medium">Reviews Written</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-6 text-center">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-yellow-600">
                {stats.averageRating.toFixed(1)}
              </h3>
              <p className="text-yellow-700 font-medium">Average Rating</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-green-600">
                {stats.favoriteGenre || 'N/A'}
              </h3>
              <p className="text-green-700 font-medium">Favorite Genre</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            Your Reviews
          </h2>

          {userReviews.length === 0 ? (
            <div className="text-center py-12">
              <Film className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
              <p className="text-gray-500 mb-6">
                Start reviewing movies to see them appear here!
              </p>
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Film className="w-5 h-5 mr-2" />
                Browse Movies
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {userReviews.map((review) => {
                const movie = movies[review.movieId];
                return (
                  <div
                    key={review.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Movie Poster */}
                      {movie && (
                        <img
                          src={movie.posterUrl}
                          alt={`${movie.title} Poster`}
                          className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      
                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {movie?.title || 'Unknown Movie'}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                                <span className="ml-2 font-semibold">{review.rating}/5</span>
                              </div>
                              {review.createdAt && (
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>{formatDate(review.createdAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {review.comment}
                        </p>
                        
                        {movie && (
                          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded-full">
                              {movie.genre}
                            </span>
                            <span>{movie.director}</span>
                            <span>{new Date(movie.releaseDate).getFullYear()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;